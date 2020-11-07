package food.truck.api.data.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name = User.TABLE_NAME)
public class User {
    public static final String TABLE_NAME = "users";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
        name = TABLE_NAME + "_GENERATOR",
        sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "user_id")
    Long id;

    @Column(name = "user_email", nullable = false, unique = true)
    String emailAddress;

    @Column(name = "first_name", nullable = false)
    String firstName;

    @Column(name = "last_name", nullable = false)
    String lastName;

    @JsonIgnore
    @Column(name = "pass_hash", nullable = false)
    String passwordHash;

    @JsonIgnore
    @Column(name = "authority", nullable = false)
    String authority;

    @JsonIgnore
    @Column(name = "enabled", nullable = false)
    boolean enabled;

    @JsonIgnore
    @Transient
    String password;

    @JsonIgnore
    @Column(name = "user_location_latitude")
    Double latitude;

    @JsonIgnore
    @Column(name = "user_location_longitude")
    Double longitude;

    @Column(name = "user_description")
    String description;

    @Column(name = "user_avatar")
    String avatarURL;

    @Column(name = "user_since", columnDefinition = "TIMESTAMP")
    ZonedDateTime sinceTime;
}
