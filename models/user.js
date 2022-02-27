const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, maxlength: 50, required: true },
        company: { type: String, maxlength: 100, required: true },
        address: { type: String, maxlength: 150 },
        phone: { type: Number, maxlength: 11 },
        email: { type: String, maxlength: 50, required: true, unique: true },
        password: { type: String, minlength: 8, maxlength: 100, required: true },
        isVerified: { type: Boolean, required: true, default: false },
        refreshJWT: {
            token: { type: String, maxlength: 500, default: ""},
            addedAt: { type: Date, required: true, default: Date.now() },
        }
    },
    { timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);