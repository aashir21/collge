package com.collge.NEARBY_SERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "locations")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Nearby {

    @Id
    private String nearbyEntryId;

    private Long userId;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;
    private LocalDateTime lastTimeAtLocation;
    private boolean isDiscoverable;

}
