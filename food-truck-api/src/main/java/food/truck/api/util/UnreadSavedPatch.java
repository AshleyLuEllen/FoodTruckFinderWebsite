package food.truck.api.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnreadSavedPatch {
    Boolean saved;
    Boolean unread;
}
