"use client"

import type React from "react"
import { useState, useEffect } from "react"

export default function AdminSettings() {
  const [adminName, setAdminName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [profilePhoto, setProfilePhoto] = useState<string>("/admin-profile.png")
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // 🔥 important

  useEffect(() => {
    fetchAdmin()
  }, [])

  // ================= FETCH ADMIN =================
  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (data.success) {
        setAdminName(data.admin.name)
        setEmail(data.admin.email)
        setProfilePhoto(data.admin.image || "/admin-profile.png")
      }
    } catch (err) {
      console.log(err)
    }
  }

  // ================= IMAGE PREVIEW =================
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setSelectedFile(file) // 🔥 save real file

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string) // preview only
      }
      reader.readAsDataURL(file)
    }
  }

  // ================= REMOVE IMAGE =================
  const handleRemoveProfilePhoto = () => {
    setProfilePhoto("/admin-profile.png")
    setSelectedFile(null)
  }

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      const formData = new FormData()
      formData.append("name", adminName)
      formData.append("email", email)

      // 🔥 send image if selected
      if (selectedFile) {
        formData.append("image", selectedFile)
      }

      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        alert("Profile updated successfully")

        if (data.image) {
          setProfilePhoto(data.image)
        }

        fetchAdmin()
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.log(err)
      alert("Error updating profile")
    }
  }

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        "http://localhost:5000/api/admin/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      )

      const data = await res.json()

      if (data.success) {
        alert("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      <div className="px-4 md:px-8 py-6 pb-24">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-neutral-600">
              Manage your profile and password
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ================= PROFILE ================= */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-6">Admin Profile</h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">

                {/* IMAGE */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200">
                    <img
                      src={profilePhoto}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex gap-3">
                    <label className="bg-neutral-200 px-4 py-2 rounded-lg cursor-pointer">
                      Change Photo
                      <input
                        type="file"
                        onChange={handleProfilePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveProfilePhoto}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* NAME */}
                <div>
                  <label className="text-sm">Admin Name</label>
                  <input
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg"
                  />
                </div>

                <button className="bg-orange-600 text-white px-6 py-2 rounded-lg">
                  Update Profile
                </button>
              </form>
            </div>

            {/* ================= PASSWORD ================= */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-6">Change Password</h2>

              <form onSubmit={handleChangePassword} className="space-y-4">

                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <button className="bg-orange-600 text-white px-6 py-2 rounded-lg">
                  Change Password
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
