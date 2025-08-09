package com.collge.SEARCHSERVICE.service_v2;

import com.collge.SEARCHSERVICE.dto.SearchUserData;
import com.collge.SEARCHSERVICE.model.User;
import com.collge.SEARCHSERVICE.repository_v2.UserSearchRepository_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserSearchService_V2 {

    @Autowired
    private UserSearchRepository_V2 userSearchRepositoryV2;

    public ResponseEntity<?> getAllUsersWithQuery(String searchTerm, int offset, int pageSize, Long userId) throws Exception {
        try{

            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("first_name").ascending());
            Page<User> userPage =  userSearchRepositoryV2.searchUsersExcludingBlocked(searchTerm, userId, pageable);

            List<User> usersFromRepo = userPage.getContent();

            List<SearchUserData> usersToSendBack = convertUserToSearchedUserDTO(usersFromRepo);

            return new ResponseEntity<>(usersToSendBack, HttpStatusCode.valueOf(200));
        }
        catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }


    private List<SearchUserData> convertUserToSearchedUserDTO(List<User> users){

        List<SearchUserData> convertedUsers = new ArrayList<>();

        users.forEach((user) -> {

            SearchUserData searchUserData = SearchUserData.builder()
                    .userId(user.getUserId())
                    .avatar(user.getAvatar())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .username(user.getUsername())
                    .premiumUser(user.isPremiumUser())
                    .role(user.getRole())
                    .build();

            convertedUsers.add(searchUserData);
        });

        return convertedUsers;
    }

}
