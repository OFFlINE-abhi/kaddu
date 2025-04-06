"use client";

import { useEffect, useState } from "react";
import { auth, storage, db } from "@/app/firebase";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Pencil, Save, Upload, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Profile() {
    const { theme, setTheme } = useTheme();
    const user = auth.currentUser;

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || "https://i.pravatar.cc/100");
    const [bio, setBio] = useState("Hey there! I'm Kaddu. I love coding, creativity & chai! 🍵");
    const [uploading, setUploading] = useState(false);
    const [activityLog, setActivityLog] = useState<{ emoji: string; text: string; time: string }[]>([]);

    useEffect(() => {
        if (!user) return;

        // Fetch activity logs in real-time
        const q = query(collection(db, `users/${user.uid}/activity`), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setActivityLog(
                snapshot.docs.map((doc) => ({
                    emoji: doc.data().emoji,
                    text: doc.data().text,
                    time: formatDate(doc.data().timestamp.toDate()),
                }))
            );
        });

        return () => unsubscribe();
    }, [user]);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    const logActivity = async (emoji: string, text: string) => {
        if (!user) return;
        await addDoc(collection(db, `users/${user.uid}/activity`), {
            emoji,
            text,
            timestamp: new Date(),
        });
    };

    const toggleEdit = () => setEditMode(!editMode);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            setUploading(true);
            const fileRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            await updateProfile(user, { photoURL: url });
            setPhotoURL(url);
            await logActivity("📷", "Updated profile picture");
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (user) {
            await updateProfile(user, { displayName: name });
            await logActivity("📝", "Updated profile information");
            setEditMode(false);
        }
    };

    return (
        <motion.div
            className="p-8 rounded-xl shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-all duration-500"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">👤 Profile</h2>
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 bg-muted rounded-full hover:rotate-180 transition-transform"
                    title="Toggle theme"
                >
                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* Profile Image */}
            <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                    <motion.img
                        src={photoURL}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-primary shadow-lg"
                        animate={{ rotate: uploading ? 360 : 0 }}
                        transition={{ duration: 1, repeat: uploading ? Infinity : 0 }}
                    />
                    <label className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-full cursor-pointer shadow-lg hover:scale-105 transition">
                        <Upload className="text-white w-4 h-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} title="Upload profile picture" />
                    </label>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{email}</p>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
                    <input
                        className="w-full p-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!editMode}
                        placeholder="Enter your name"
                        title="Name input field"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                    <input
                        className="w-full p-2 mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        value={email}
                        disabled
                        placeholder="Your email address"
                        title="Email input field"
                    />
                </div>
            </div>

            {/* Bio Section */}
            <div className="mb-6">
                <label className="text-sm text-gray-600 dark:text-gray-400">About Me</label>
                <textarea
                    className="w-full p-3 mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none resize-none"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!editMode}
                    title="About Me input field"
                    placeholder="Write something about yourself"
                />
            </div>

            {/* Save Button */}
            <button
                onClick={editMode ? handleSave : toggleEdit}
                className="px-5 py-2 bg-primary text-white rounded-xl flex items-center gap-2 hover:scale-105 transition"
            >
                {editMode ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                {editMode ? "Save Changes" : "Edit Profile"}
            </button>

            {/* Activity Timeline */}
            <div>
                <h3 className="text-xl font-semibold mt-8">📅 Recent Activity</h3>
                <ul className="space-y-3 mt-3">
                    {activityLog.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                            <span className="text-xl">{item.emoji}</span>
                            <div>
                                <p className="font-medium">{item.text}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
