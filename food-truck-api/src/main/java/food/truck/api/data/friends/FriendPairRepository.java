package food.truck.api.data.friends;

import food.truck.api.data.truck.Truck;
import food.truck.api.data.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendPairRepository extends JpaRepository<FriendPair, FriendPairId> {
    boolean existsByUser1AndUser2(User user1, User user2);

    List<FriendPair> findAllByUser1(User user1);

    List<FriendPair> findAllByUser2(User user2);
}
