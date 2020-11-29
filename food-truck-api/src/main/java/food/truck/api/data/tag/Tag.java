package food.truck.api.data.tag;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = Tag.TABLE_NAME)
public class Tag {
    public static final String TABLE_NAME = "tags";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
        name = TABLE_NAME + "_GENERATOR",
        sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "tag_id")
    Long id;

    @Column(name = "tag_name")
    String name;

    @Column(name = "tag_cat")
    String category;
}

