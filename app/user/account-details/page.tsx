"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import SiteHeader from "../../components/site-header";
import axios from "axios";
import { getProfile, updateProfile } from "../../../lib/profileApi";


export default function AccountDetailsPage() {
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    image: string | File;
  }>({
    name: "",
    email: "",
    image: "", // initial image is a string (URL)
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileEdited, setProfileEdited] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch profile on mount
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const user = await getProfile();
      setProfileData({
        name: user.name,
        email: user.email,
        image: user.image || "",
      });
      setImagePreview(user.image || null);
    } catch (err: any) {
      console.error(err.message);
    }
  };
  fetchProfile();
}, []);


  // Handle input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileEdited(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setProfileEdited(true);
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
  setIsSavingProfile(true);
  try {
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    if (profileData.image instanceof File) {
      formData.append("image", profileData.image);
    }

    const updatedUser = await updateProfile(formData);
    setProfileData(updatedUser);
    setImagePreview(updatedUser.image || null);
    setProfileEdited(false);
  } catch (err: any) {
    console.error(err.message);
  } finally {
    setIsSavingProfile(false);
  }
};


  // Update password
  const handleUpdatePassword = async () => {
    setPasswordErrors("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordErrors("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordErrors("New password must be at least 8 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await axios.put("/api/profile", { password: passwordData.newPassword });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
    }
    setIsUpdatingPassword(false);
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      <SiteHeader variant="guest" />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Account Details</h1>

        {/* Profile Info + Image */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 md:p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <div className="flex gap-3">
              {profileEdited && (
                <Button
                  onClick={() => {
                    setProfileEdited(false);
                    setImagePreview(
                      profileData.image
                        ? profileData.image instanceof File
                          ? URL.createObjectURL(profileData.image)
                          : profileData.image
                        : null
                    );
                  }}
                  className="px-4 py-2 bg-neutral-300 text-neutral-900 rounded hover:bg-neutral-400 transition"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSaveProfile}
                isLoading={isSavingProfile}
                loadingText="Saving..."
                className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
              >
                Save Changes
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={
                      profileData.image instanceof File
                        ? URL.createObjectURL(profileData.image)
                        : profileData.image || "/default-avatar.png"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full w-full text-gray-500">
                    No Image
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">Password & Security</h2>
          <p className="text-neutral-600 mb-6">
            Update your password regularly to keep your account secure.
          </p>

          {passwordErrors && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {passwordErrors}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <Button
              onClick={handleUpdatePassword}
              isLoading={isUpdatingPassword}
              loadingText="Updating..."
              className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition w-fit"
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
