package com.collge.USERSERVICE.model;

import com.collge.USERSERVICE.enums.OnlineStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(
        name = "users"
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    @Column(
            name = "user_id"
    )
    private Long userId;
    @Column(
            name = "first_name"
    )
    private @NotBlank(
            message = "First Name is a required field"
    ) String firstName;
    @Column(
            name = "last_name"
    )
    private @NotBlank(
            message = "Last name is a required field"
    ) String lastName;
    @Column(
            name = "username"
    )
    private @NotBlank(
            message = "Username is required"
    ) String username;
    private String password;
    @Column(
            name = "email"
    )
    private @NotNull(
            message = "Email is required"
    ) @Email(
            message = "Please enter a valid email address"
    ) String email = "";
    @Lob
    private String avatar = "";
    private String bio = "";
    private String title;
    private Integer reputation;
    private Integer fire;
    @Column(
            name = "university_id"
    )
    private Integer universityId;
    @Column(
            name = "is_verified"
    )
    private boolean isVerified = false;
    @Column(
            name = "is_premium_user"
    )
    private boolean isPremiumUser = false;

    private boolean isBanned = false;

    private boolean isWinkable;

    private boolean isLinkUpVerified;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Transient
    private List<Pokes> pokes;
    @Transient
    private List<Clubs> clubs;

    @Transient
    private List<Post> posts;

    @Transient
    private List<Matches> matches;
    @Transient
    private List<WhoVisited> whoVisited;
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Token> tokens;
    private Integer yearOfGraduation;

    private LocalDateTime registrationDate;

    @Column(name = "registration_type")
    private String registrationType;

    private String location;
    @OneToOne(
            mappedBy = "user",
            cascade = {CascadeType.ALL},
            orphanRemoval = true
    )
    private ConfirmationToken confirmationToken;
    @OneToOne(
            mappedBy = "user",
            cascade = {CascadeType.ALL},
            orphanRemoval = true
    )
    @JsonIgnore
    private OTP otp;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private OnlineStatus onlineStatus;

    @OneToMany(mappedBy = "user")
    private Set<Friendship> friendships = new HashSet<>();

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }

}
