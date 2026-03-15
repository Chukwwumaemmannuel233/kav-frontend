"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import SiteHeader from "../../components/site-header";
import axios from "axios";
import { getProfile, updateProfile } from "../../../lib/profileApi";

// Reusable Input component
function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">{label}</label>}
      <input
        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
        {...props}
      />
    </div>
  );
}

export default function AccountDetailsPage() {
  const [profileData, setProfileData] = useState<{ name: string; email: string; image: string | File }>({
    name: "",
    email: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileEdited, setProfileEdited] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileEdited(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setProfileEdited(true);
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileEdited(false);
    setImagePreview(profileData.image instanceof File ? null : profileData.image);
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      if (profileData.image instanceof File) formData.append("image", profileData.image);

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

  const handleUpdatePassword = async () => {
    setPasswordErrors("");

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
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
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
    }
    setIsUpdatingPassword(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900 pb-24">
      <SiteHeader variant="guest" />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900 dark:text-white">Account Details</h1>

        {/* Profile Section */}
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 md:p-8 mb-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Profile Information</h2>
            <div className="flex gap-3">
              {profileEdited && (
                <Button onClick={handleCancelProfileEdit} className="px-4 py-2 bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded hover:bg-neutral-400 dark:hover:bg-neutral-600 transition">
                  Cancel
                </Button>
              )}
              <Button onClick={handleSaveProfile} isLoading={isSavingProfile} loadingText="Saving..." className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition">
                Save Changes
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full w-full text-gray-500 dark:text-neutral-400">No Image</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2 text-sm text-neutral-700 dark:text-neutral-300" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" name="name" value={profileData.name} onChange={handleProfileChange} />
              <Input label="Email" type="email" name="email" value={profileData.email} onChange={handleProfileChange} />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Password & Security</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">Update your password regularly to keep your account secure.</p>

          {passwordErrors && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {passwordErrors}
            </div>
          )}

          <div className="space-y-6">
            {[
              { label: "Current Password", name: "currentPassword", placeholder: "••••••••" },
              { label: "New Password", name: "newPassword", placeholder: "Enter new password" },
              { label: "Confirm New Password", name: "confirmPassword", placeholder: "Confirm new password" },
            ].map((field) => (
              <Input
                key={field.name}
                label={field.label}
                type="password"
                name={field.name}
                placeholder={field.placeholder}
                value={passwordData[field.name as keyof typeof passwordData]}
                onChange={handlePasswordChange}
              />
            ))}

            <Button onClick={handleUpdatePassword} isLoading={isUpdatingPassword} loadingText="Updating..." className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition w-fit">
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}