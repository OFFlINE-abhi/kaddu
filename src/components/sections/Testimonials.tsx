"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

type Testimonial = {
  id: string;
  author: string;
  message: string;
  role?: string;
  avatar?: string;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const querySnapshot = await getDocs(collection(db, "testimonials"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Testimonial[];
      setTestimonials(data);
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">💬 Testimonials</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map(({ id, author, message, role, avatar }) => (
          <motion.div
            key={id}
            className="p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.03 }}
          >
            {avatar && (
              <img
                src={avatar}
                alt={author}
                className="w-12 h-12 rounded-full mb-4 object-cover"
              />
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-3">"{message}"</p>
            <h4 className="font-semibold text-md text-gray-900 dark:text-white">{author}</h4>
            {role && <span className="text-xs text-gray-500 dark:text-gray-400">{role}</span>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
