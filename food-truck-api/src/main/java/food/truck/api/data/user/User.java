package food.truck.api.data.user;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.NaturalId;

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

    @Column(name = "pass_hash", nullable = false)
//    @JsonIgnore
    String passwordHash;

    @Column(name = "authority", nullable = false)
//    @JsonIgnore
    String authority;

    @Column(name = "enabled", nullable = false)
//    @JsonIgnore
    boolean enabled;

    @Transient
//    @JsonIgnore
    String password;
}
