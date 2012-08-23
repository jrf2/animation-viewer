var Camera = {
    position : { x: 0, y: 0 },
    zoom : 1,
    rotation : 0,

    // getters
    GetPosition : function() {
        return this.position;
    },

    GetZoom : function() {
        return this.zoom;
    },

    GetRotation : function() {
        return this.rotation;
    },

    // setters
    SetPosition : function(pos) {
		this.position = pos;
    },

    SetZoom : function(z) {
        this.zoom = z;
    },

    SetRotation : function(rot) {

    },

    // methods
    GetViewRectangle : function() {

    },

    GetViewSize : function() {

    },

    ApplyTransformation : function(ctx) {
        ctx.translate(this.GetPosition().x, this.GetPosition().y);
        ctx.scale(this.GetZoom(), this.GetZoom());
        ctx.rotate(this.GetRotation());
    }
}