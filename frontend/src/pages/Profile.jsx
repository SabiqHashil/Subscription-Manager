import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Phone, Mail, Lock, Save, X, Edit2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Profile({ user, setUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Password Form Data
    const [passwordData, setPasswordData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleProfileChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const payload = {
                name: formData.name,
                phone: formData.phone,
                // Email is usually not editable or requires verifying, keeping simpler for now (or backend ignores it if not changing)
            };

            const response = await axios.put(`${API}/auth/me`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(response.data);
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.detail || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwordData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const payload = {
                password: passwordData.password,
            };

            await axios.put(`${API}/auth/me`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Password updated successfully");
            setPasswordData({ password: "", confirmPassword: "" });
            setShowPasswordSection(false);
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error(error.response?.data?.detail || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8" data-testid="profile-page">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>

            {/* Personal Information Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                        <CardDescription>Manage your personal details</CardDescription>
                    </div>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit Details
                        </Button>
                    ) : (
                        <Button onClick={() => setIsEditing(false)} variant="ghost" className="gap-2 text-slate-500">
                            <X className="w-4 h-4" />
                            Cancel
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-500" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleProfileChange("name", e.target.value)}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    disabled={true} // Email typically hard to change without re-verification
                                    className="bg-slate-50 text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-500" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end pt-2">
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2" disabled={loading}>
                                    <Save className="w-4 h-4" />
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-xl">Security</CardTitle>
                        <CardDescription>Update your password</CardDescription>
                    </div>
                    <Button
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        variant="outline"
                        className="gap-2"
                    >
                        <Lock className="w-4 h-4" />
                        {showPasswordSection ? "Hide Password Fields" : "Change Password"}
                    </Button>
                </CardHeader>

                {showPasswordSection && (
                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => handlePasswordChange("password", e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>

                            <div className="flex justify-start">
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2" disabled={loading}>
                                    <Save className="w-4 h-4" />
                                    {loading ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
