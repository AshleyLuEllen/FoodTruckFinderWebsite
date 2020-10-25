package food.truck.api.data.friends;

import food.truck.api.data.tag.Tag;
import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = FriendPair.TABLE_NAME)
@IdClass(FriendPairId.class)
public class FriendPair {
    public static final String TABLE_NAME = "friends";

    @Id
    @JoinColumn(name = "friend_user_id_1")
    @ManyToOne
    User user1;

    @Id
    @JoinColumn(name = "friend_user_id_2")
    @ManyToOne
    User user2;
}


