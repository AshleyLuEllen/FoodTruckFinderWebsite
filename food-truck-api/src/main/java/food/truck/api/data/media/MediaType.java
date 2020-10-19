package food.truck.api.data.media;

public enum MediaType {
    TRUCK_IMAGE(Scope.TRUCK),
    PROFILE_IMAGE(Scope.USER),
    MENU_IMAGE(Scope.MENU),
    MENU_PDF(Scope.MENU),
    REVIEW_IMAGE(Scope.REVIEW);

    private Scope scope;

    MediaType(Scope scope) {
        this.scope = scope;
    }

    public Scope getScope() {
        return scope;
    }

    public enum Scope {
        TRUCK,
        USER,
        MENU,
        REVIEW
    }
}
