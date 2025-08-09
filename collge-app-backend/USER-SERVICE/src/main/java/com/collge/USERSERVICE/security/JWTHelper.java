package com.collge.USERSERVICE.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import com.collge.USERSERVICE.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JWTHelper {

    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    //15 minutes
//    private final long JWT_TOKEN_VALIDITY = 15 * 60 * 1000;
    private final long JWT_TOKEN_VALIDITY = 60 * 60 * 1000;

    // 2 months * 30 days per month * 24 hours per day * 60 minutes per hour * 60 seconds per minute * 1000 milliseconds per second
    // 2 months total expiry
    private final long JWT_REFRESH_TOKEN_VALIDITY = 2L * 30L * 24L * 60L * 60L * 1000L;

    public String getUsernameFromToken(String token) {
        return this.getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return this.getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        Claims claims = this.getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    public Claims getAllClaimsFromToken(String token) {
//        return (Claims)Jwts.parser().setSigningKey("27Jx8QTRFT2aPm2tSiHmGM51peZwMvB1giNMqUYT5ZSmgaZwjwPRB2D2qCZNxMttUW8Bt0yFmJxgNidHbDFCKacTu69uVy6eYYB6").parseClaimsJws(token).getBody();
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenExpired(String token) {
        Date date = (Date)this.getClaimFromToken(token, Claims::getExpiration);
        return date.before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap();
        return this.buildToken(claims, userDetails,JWT_TOKEN_VALIDITY);
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap();
        return this.buildToken(claims, user,JWT_TOKEN_VALIDITY);
    }

    public String generateRefreshToken(
            UserDetails userDetails
    ) {
        return buildToken(new HashMap<>(), userDetails, JWT_REFRESH_TOKEN_VALIDITY);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        String username = this.getUsernameFromToken(token);
        return username.equals(userDetails.getUsername()) && !this.isTokenExpired(token);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
