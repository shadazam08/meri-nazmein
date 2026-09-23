"use client";

import Image from "next/image";
import {
    useEffect,
    useRef,
    useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

const MAX_AVATAR_SIZE =
    2 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

type AuthorProfileFormProps = {
    profile: {
        name: string;
        penName: string | null;
        username: string;
        bio: string | null;
        avatarUrl: string | null;
        email: string;
    };
};

export function AuthorProfileForm({
    profile,
}: AuthorProfileFormProps) {
    const supabase = createClient();

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null,
        );

    const previewUrlRef =
        useRef<string | null>(null);

    const [name, setName] =
        useState(profile.name);

    const [penName, setPenName] =
        useState(
            profile.penName ?? "",
        );

    const [username, setUsername] =
        useState(profile.username);

    const [bio, setBio] =
        useState(
            profile.bio ?? "",
        );

    const [avatarUrl, setAvatarUrl] =
        useState(
            profile.avatarUrl ?? "",
        );

    const [avatarFile, setAvatarFile] =
        useState<File | null>(null);

    const [avatarPreview, setAvatarPreview] =
        useState<string>(
            profile.avatarUrl ?? "",
        );

    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [profileError, setProfileError] =
        useState("");

    const [profileSuccess, setProfileSuccess] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordSuccess, setPasswordSuccess] =
        useState("");

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [changingPassword, setChangingPassword] =
        useState(false);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(
                    previewUrlRef.current,
                );
            }
        };
    }, []);

    function openFilePicker() {
        if (savingProfile) {
            return;
        }

        fileInputRef.current?.click();
    }

    function handleAvatarChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setProfileError("");
        setProfileSuccess("");

        if (
            !ALLOWED_AVATAR_TYPES.includes(
                file.type,
            )
        ) {
            setProfileError(
                "Please select a JPG, PNG or WEBP image.",
            );

            event.target.value = "";

            return;
        }

        if (
            file.size > MAX_AVATAR_SIZE
        ) {
            setProfileError(
                "Avatar image must be 2 MB or smaller.",
            );

            event.target.value = "";

            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(
                previewUrlRef.current,
            );
        }

        const localPreview =
            URL.createObjectURL(file);

        previewUrlRef.current =
            localPreview;

        setAvatarFile(file);
        setAvatarPreview(localPreview);
    }

    async function uploadAvatar() {
        if (!avatarFile) {
            return avatarUrl;
        }

        const {
            data: {
                user,
            },
            error: userError,
        } =
            await supabase.auth.getUser();

        if (
            userError ||
            !user
        ) {
            throw new Error(
                "Your session has expired. Please login again.",
            );
        }

        const avatarPath =
            `${user.id}/avatar`;

        const {
            error: uploadError,
        } =
            await supabase.storage
                .from("avatars")
                .upload(
                    avatarPath,
                    avatarFile,
                    {
                        cacheControl:
                            "3600",
                        contentType:
                            avatarFile.type,
                        upsert: true,
                    },
                );

        if (uploadError) {
            throw new Error(
                uploadError.message ||
                "Unable to upload avatar.",
            );
        }

        const {
            data,
        } =
            supabase.storage
                .from("avatars")
                .getPublicUrl(
                    avatarPath,
                );

        if (
            !data.publicUrl
        ) {
            throw new Error(
                "Avatar URL could not be generated.",
            );
        }

        return `${data.publicUrl}?v=${Date.now()}`;
    }

    async function handleProfileSave() {
        if (savingProfile) {
            return;
        }

        setProfileError("");
        setProfileSuccess("");

        setSavingProfile(true);

        try {
            const nextAvatarUrl =
                await uploadAvatar();

            const response =
                await fetch(
                    "/api/author/profile",
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            penName,
                            username,
                            bio,
                            avatarUrl:
                                nextAvatarUrl,
                        }),
                    },
                );

            const result =
                await response.json();

            if (!response.ok) {
                setProfileError(
                    result.error ??
                    "Unable to update profile.",
                );

                return;
            }

            setName(
                result.profile.name,
            );

            setPenName(
                result.profile.penName ??
                "",
            );

            setUsername(
                result.profile.username,
            );

            setBio(
                result.profile.bio ??
                "",
            );

            setAvatarUrl(
                result.profile.avatarUrl ??
                "",
            );

            setAvatarPreview(
                result.profile.avatarUrl ??
                "",
            );

            setAvatarFile(null);

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    "";
            }

            setProfileSuccess(
                "Profile updated successfully.",
            );
        } catch (error) {
            setProfileError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setSavingProfile(false);
        }
    }

    async function handlePasswordChange() {
        if (changingPassword) {
            return;
        }

        setPasswordError("");
        setPasswordSuccess("");

        const current =
            currentPassword.trim();

        const next =
            newPassword.trim();

        const confirm =
            confirmPassword.trim();

        if (!current) {
            setPasswordError(
                "Current password is required.",
            );

            return;
        }

        if (!next) {
            setPasswordError(
                "New password is required.",
            );

            return;
        }

        if (next.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters.",
            );

            return;
        }

        if (next !== confirm) {
            setPasswordError(
                "New password and confirmation do not match.",
            );

            return;
        }

        if (current === next) {
            setPasswordError(
                "New password must be different from your current password.",
            );

            return;
        }

        setChangingPassword(true);

        try {
            const {
                error,
            } =
                await supabase.auth.updateUser(
                    {
                        password: next,
                        current_password:
                            current,
                    },
                );

            if (error) {
                setPasswordError(
                    error.message ||
                    "Unable to change password.",
                );

                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setPasswordSuccess(
                "Password changed successfully.",
            );
        } catch {
            setPasswordError(
                "Something went wrong. Please try again.",
            );
        } finally {
            setChangingPassword(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* =================================================
                PROFILE INFORMATION
            ================================================= */}
            <section className="rounded-3xl border border-[#E5DED0] bg-white shadow-sm">
                <div className="border-b border-[#E5DED0] px-6 py-5 sm:px-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-mn-gold-dark">
                        Profile
                    </p>

                    <h2 className="mt-1.5 font-poetry text-2xl font-semibold text-mn-navy sm:text-3xl">
                        Profile Information
                    </h2>

                    <p className="mt-1.5 text-sm text-mn-text-muted">
                        Apni public author identity ko manage kijiye.
                    </p>
                </div>

                <div className="grid gap-7 p-6 sm:p-7 lg:grid-cols-[220px_minmax(0,1fr)]">
                    {/* =================================================
                        PROFILE PICTURE
                    ================================================= */}
                    <div>
                        <p className="text-sm font-semibold text-mn-navy">
                            Profile Picture
                        </p>

                        <div className="mt-4 flex flex-col items-center">
                            {avatarPreview ? (
                                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-[#E5DED0] bg-[#F7F2E8]">
                                    <Image
                                        src={avatarPreview}
                                        alt={`${name} profile`}
                                        fill
                                        sizes="128px"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-full border border-mn-gold/30 bg-[#F7F2E8] font-poetry text-5xl text-mn-navy">
                                    {name
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase() ||
                                        "A"}
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handleAvatarChange
                                }
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={
                                    openFilePicker
                                }
                                disabled={
                                    savingProfile
                                }
                                className="mt-4 inline-flex items-center justify-center rounded-full border border-mn-navy px-5 py-2.5 text-xs font-semibold text-mn-navy transition hover:bg-mn-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {avatarFile
                                    ? "Choose Different Photo"
                                    : "Upload Photo"}
                            </button>

                            {avatarFile && (
                                <p className="mt-2 max-w-[190px] truncate text-center text-[11px] font-medium text-mn-navy">
                                    {avatarFile.name}
                                </p>
                            )}

                            <p className="mt-3 text-center text-[11px] leading-5 text-mn-text-muted">
                                JPG, PNG ya WEBP.
                                Maximum 2 MB.
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        PROFILE FIELDS
                    ================================================= */}
                    <div className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="profile-email"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                Email
                            </label>

                            <input
                                id="profile-email"
                                type="email"
                                value={profile.email}
                                readOnly
                                aria-readonly="true"
                                className="w-full cursor-not-allowed rounded-xl border border-[#DDD4C5] bg-[#EEE8DC] px-4 py-3.5 text-sm text-mn-text-muted outline-none"
                            />

                            <p className="mt-2 text-xs text-mn-text-muted">
                                Email Supabase Auth se managed hai.
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="profile-name"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                Name
                            </label>

                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value,
                                    )
                                }
                                maxLength={80}
                                className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm text-mn-navy outline-none transition placeholder:text-[#918A7D] focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10"
                            />
                        </div>

                        {/* Pen Name */}
                        <div>
                            <label
                                htmlFor="profile-pen-name"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                Pen Name
                                <span className="ml-1 font-normal text-mn-text-muted">
                                    (optional)
                                </span>
                            </label>

                            <input
                                id="profile-pen-name"
                                type="text"
                                value={penName}
                                onChange={(event) =>
                                    setPenName(
                                        event.target.value,
                                    )
                                }
                                maxLength={80}
                                placeholder="Your literary name"
                                className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm text-mn-navy outline-none transition placeholder:text-[#918A7D] focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10"
                            />

                            <p className="mt-2 text-xs text-mn-text-muted">
                                Poetry pages par ye naam public mein dikhaya jayega.
                            </p>
                        </div>

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="profile-username"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                Username
                            </label>

                            <div className="flex overflow-hidden rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] focus-within:border-mn-gold focus-within:ring-4 focus-within:ring-mn-gold/10">
                                <span className="flex items-center border-r border-[#DDD4C5] px-3 text-sm text-mn-text-muted">
                                    @
                                </span>

                                <input
                                    id="profile-username"
                                    type="text"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(
                                            event.target.value
                                                .toLowerCase()
                                                .replace(
                                                    /[^a-z0-9_]/g,
                                                    "",
                                                ),
                                        )
                                    }
                                    maxLength={30}
                                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-mn-navy outline-none"
                                />
                            </div>

                            <p className="mt-2 text-xs text-mn-text-muted">
                                Public profile: /authors/
                                {username ||
                                    "username"}
                            </p>
                        </div>

                        {/* Bio */}
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="profile-bio"
                                    className="block text-sm font-semibold text-mn-navy"
                                >
                                    Bio
                                </label>

                                <span className="text-[11px] text-mn-text-muted">
                                    {bio.length}/500
                                </span>
                            </div>

                            <textarea
                                id="profile-bio"
                                value={bio}
                                onChange={(event) =>
                                    setBio(
                                        event.target.value,
                                    )
                                }
                                maxLength={500}
                                rows={5}
                                placeholder="Apne writing style aur journey ke baare mein likhiye..."
                                className="w-full resize-y rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm leading-6 text-mn-navy outline-none transition placeholder:text-[#918A7D] focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10"
                            />
                        </div>

                        {/* Messages */}
                        {profileError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                            >
                                {profileError}
                            </div>
                        )}

                        {profileSuccess && (
                            <div
                                role="status"
                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                            >
                                {profileSuccess}
                            </div>
                        )}

                        {/* Save */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={
                                    handleProfileSave
                                }
                                disabled={
                                    savingProfile
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-mn-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-mn-blue disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {savingProfile
                                    ? "Saving..."
                                    : "Save Profile"}

                                {!savingProfile && (
                                    <span aria-hidden="true">
                                        →
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                SECURITY
            ================================================= */}
            <section className="rounded-3xl border border-[#E5DED0] bg-white shadow-sm">
                <div className="border-b border-[#E5DED0] px-6 py-5 sm:px-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-mn-gold-dark">
                        Security
                    </p>

                    <h2 className="mt-1.5 font-poetry text-2xl font-semibold text-mn-navy sm:text-3xl">
                        Change Password
                    </h2>

                    <p className="mt-1.5 text-sm text-mn-text-muted">
                        Apne author account ka password securely update kijiye.
                    </p>
                </div>

                <div className="max-w-2xl p-6 sm:p-7">
                    <div className="space-y-5">
                        {/* Current Password */}
                        <div>
                            <label
                                htmlFor="current-password"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                Current Password
                            </label>

                            <input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value,
                                    )
                                }
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm text-mn-navy outline-none transition focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="new-password"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                New Password
                            </label>

                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value,
                                    )
                                }
                                minLength={8}
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm text-mn-navy outline-none transition focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10"
                            />

                            <p className="mt-2 text-xs text-mn-text-muted">
                                Minimum 8 characters.
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="mb-2 block text-sm font-semibold text-mn-navy"
                            >
                                Confirm New Password
                            </label>

                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value,
                                    )
                                }
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-[#DDD4C5] bg-[#F7F2E8] px-4 py-3.5 text-sm text-mn-navy outline-none transition focus:border-mn-gold focus:bg-[#F3EDE1] focus:ring-4 focus:ring-mn-gold/10"
                            />
                        </div>

                        {passwordError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                            >
                                {passwordError}
                            </div>
                        )}

                        {passwordSuccess && (
                            <div
                                role="status"
                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                            >
                                {passwordSuccess}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={
                                    handlePasswordChange
                                }
                                disabled={
                                    changingPassword
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-mn-navy px-6 py-3 text-sm font-semibold text-mn-navy transition hover:bg-mn-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {changingPassword
                                    ? "Changing Password..."
                                    : "Change Password"}

                                {!changingPassword && (
                                    <span aria-hidden="true">
                                        →
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}