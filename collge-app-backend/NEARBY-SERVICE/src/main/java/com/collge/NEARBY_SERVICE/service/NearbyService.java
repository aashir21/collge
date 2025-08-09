package com.collge.NEARBY_SERVICE.service;

import com.collge.NEARBY_SERVICE.dto.GetUserPostDataDTO;
import com.collge.NEARBY_SERVICE.dto.NearbyUser;
import com.collge.NEARBY_SERVICE.dto.UserLocationDTO;
import com.collge.NEARBY_SERVICE.exception.NearbyServiceException;
import com.collge.NEARBY_SERVICE.model.Nearby;
import com.collge.NEARBY_SERVICE.model.University;
import com.collge.NEARBY_SERVICE.repository.LocationRepository;
import com.collge.NEARBY_SERVICE.repository.UniversityRepository;
import com.collge.NEARBY_SERVICE.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.collge.NEARBY_SERVICE.exception.NearbyErrors.*;

@Service
public class NearbyService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepository universityRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(NearbyService.class);

    public ResponseEntity<?> saveUpdateUserLocation(UserLocationDTO userLocationDTO) {

        LOGGER.info("Entered saveUpdateUserLocation()");

        try{

            Long userId = userLocationDTO.getUserId();

            if(userId == null){
                return new ResponseEntity<>(CLG9098_MISSING_USER_ID, HttpStatus.BAD_REQUEST);
            }

            Optional<Nearby> optionalNearby = locationRepository.getByUserId(userId);

            LOGGER.info("Latitude: " + userLocationDTO.getLatitude());
            LOGGER.info("Longitude: " + userLocationDTO.getLongitude());

            GeoJsonPoint location = new GeoJsonPoint(
                    userLocationDTO.getLongitude(),
                    userLocationDTO.getLatitude()
            );

            if(optionalNearby.isEmpty()){

                LOGGER.info("No user location record found, creating new one...");

                Nearby nearby = Nearby.builder()
                        .userId(userId)
                        .location(location)
                        .lastTimeAtLocation(LocalDateTime.now())
                        .isDiscoverable(true)
                        .build();

                locationRepository.save(nearby);
            }
            else{

                LOGGER.info("Found an existing user location record with ID, updating...");

                Nearby exisitingNearby = optionalNearby.get();
                exisitingNearby.setLocation(location);
                exisitingNearby.setLastTimeAtLocation(LocalDateTime.now());

                locationRepository.save(exisitingNearby);
            }

            LOGGER.info("Exiting saveUpdateUserLocation()");
            return new ResponseEntity<>("Location details updated / saved", HttpStatus.OK);

        }catch (NearbyServiceException er){
            throw new NearbyServiceException(CLG9098_FAILED_TO_UPDATE_LOCATION.toString(), er.getCause());
        }

    }

    public ResponseEntity<?> findUsersWithinRadius(Long userId, Integer offset, Integer pageSize) {

        LOGGER.info("Entered findUsersWithinRadius()");

        try{
            if(userId == null){
                return new ResponseEntity<>(CLG9098_MISSING_USER_ID.toString(), HttpStatus.BAD_REQUEST);
            }

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("lastTimeAtLocation").descending());
            Optional<Nearby> optionalNearby = locationRepository.getByUserId(userId);

            if(optionalNearby.isEmpty()){
                return new ResponseEntity<>(CLG9098_LOCATION_ENTRY_NOT_FOUND.toString(), HttpStatus.NOT_FOUND);
            }

            Nearby existingNearby = optionalNearby.get();

            //GeoJson returns coordinates in this format: [longitude, latitude]
            Double longitude = existingNearby.getLocation().getCoordinates().get(0);
            Double latitude = existingNearby.getLocation().getCoordinates().get(1);

            // Convert radius from miles to meters
            Integer radius = 2;

            // Create a Point object using the given longitude and latitude
            Point location = new Point(longitude, latitude);

            // Create a Distance object with the specified radius in meters
            GeoJsonPoint point = new GeoJsonPoint(longitude, latitude);
            double distance = 3200;

            // Use the repository to find nearby users
            Page<Nearby> nearbyUsersPage = locationRepository.findByLocationNear(blockedUsers,true,point,distance,pageable);
            List<Nearby> nearbyUsers = nearbyUsersPage.getContent();
            List<NearbyUser> convertedLists = convertNearbyUsers(nearbyUsers, userId);

            LOGGER.info("Exiting findUsersWithinRadius()");
            return new ResponseEntity<>(convertedLists, HttpStatus.OK);

        }catch (NearbyServiceException err){
            throw new NearbyServiceException(CLG9098_FAILED_TO_GET_NEARBY_USERS.toString(), err.getCause());
        }
    }

    public ResponseEntity<?> getIsUserDiscoverable(Long userId){

        try{

            boolean isDiscoverable = false;
            Optional<Nearby> optionalNearby = locationRepository.getByUserId(userId);
            if(optionalNearby.isPresent()){
                Nearby nearby = optionalNearby.get();
                isDiscoverable = nearby.isDiscoverable();
            }

            return new ResponseEntity<>(isDiscoverable, HttpStatus.OK);

        }catch (NearbyServiceException e){
            throw new NearbyServiceException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> setIsUserDiscoverable(Long userId) {

        try {
            Optional<Nearby> optionalNearby = locationRepository.getByUserId(userId);

            if (!optionalNearby.isPresent()) {
                return new ResponseEntity<>("Nearby record not found for user with ID: " + userId, HttpStatus.NOT_FOUND);
            }

            Nearby nearby = optionalNearby.get();
            boolean newDiscoveryStatus = !nearby.isDiscoverable();
            nearby.setDiscoverable(newDiscoveryStatus);

            locationRepository.save(nearby);

            return new ResponseEntity<>(newDiscoveryStatus, HttpStatus.OK);

        } catch (NearbyServiceException e) {
            return new ResponseEntity<>("Failed to update discoverable status", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<NearbyUser> convertNearbyUsers(List<Nearby> nearbyUsers, Long userId) {

        List<NearbyUser> getUserPostDataDTOList = new ArrayList<>();
        LocalDateTime currentTime = LocalDateTime.now();

        nearbyUsers.forEach(user -> {
            // Check if the user's lastTimeAtLocation is within the last 4 hours
            if (Duration.between(user.getLastTimeAtLocation(), currentTime).toHours() <= 4) {
                GetUserPostDataDTO userPostDataDTO = userRepository.getUserPostDataById(user.getUserId());
                University university = universityRepository.getUniById(userPostDataDTO.getUniversityId());

                // Ensure we do not include the current user's own data
                if (!userId.equals(user.getUserId())) {
                    NearbyUser nearby = NearbyUser.builder()
                            .nearbyEntryId(user.getNearbyEntryId())
                            .userId(user.getUserId())
                            .uniName(university.getUniName())
                            .firstName(userPostDataDTO.getFirstName())
                            .lastName(userPostDataDTO.getLastName())
                            .username(userPostDataDTO.getUsername())
                            .avatar(userPostDataDTO.getAvatar())
                            .role(userPostDataDTO.getRole())
                            .isPremiumUser(userPostDataDTO.getIsPremiumUser())
                            .lastTimeAtLocation(user.getLastTimeAtLocation())
                            .build();

                    getUserPostDataDTOList.add(nearby);
                }
            }
        });

        return getUserPostDataDTOList;
    }
}
