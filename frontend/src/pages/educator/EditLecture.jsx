

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiArrowBack, BiLink, BiLoaderAlt, BiMoviePlay } from "react-icons/bi";

const EditLecture = () => {
    const navigate = useNavigate();
    const { lectureId } = useParams();

    const [title, setTitle] = useState("");
    const [videoLink, setVideoLink] = useState(""); // Ab hum sirf string (link) save karenge
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/course/get-lecture/${lectureId}`, { withCredentials: true });
                setTitle(res.data.lectureTitle || "");
                setVideoLink(res.data.videoUrl || ""); // Purana link fetch karein
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchLecture();
    }, [lectureId]);

    const handleUpdateLecture = async (e) => {
        e.preventDefault();
        if (!title.trim()) return toast.error("Please enter a lecture title");
        if (!videoLink.trim()) return toast.error("Please provide a video link");

        setLoading(true);

        try {
            // Ab hum FormData ki jagah simple JSON bhej rahe hain kyunki file nahi hai
            const response = await axios.post(
                `http://localhost:8000/api/course/edit-lecture/${lectureId}`, 
                { 
                    lectureTitle: title, 
                    videoUrl: videoLink // Direct link bhej rahe hain
                }, 
                { withCredentials: true }
            );

            if (response.data) {
                toast.success("Lecture link updated!");
                navigate(-1);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center font-bold text-slate-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[550px] mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-[#c5a358] font-bold transition-all">
                    <BiArrowBack size={20}/> Back
                </button>
            </div>

            <div className="w-full max-w-[550px] bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center text-4xl mb-5">
                        <BiMoviePlay />
                    </div>
                    <h1 className="text-3xl font-black text-[#1e293b]">Lecture Link</h1>
                    <p className="text-slate-400 mt-2 font-medium text-sm">Paste a video URL (YouTube/Cloudinary) to update this lesson.</p>
                </div>

                <form onSubmit={handleUpdateLecture} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-slate-400 ml-1">Lecture Title</label>
                        <input 
                            type="text" 
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all font-bold"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-slate-400 ml-1">Video URL / Link</label>
                        <div className="relative">
                            <BiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                            <input 
                                type="text" 
                                placeholder="https://example.com/video.mp4"
                                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all font-medium text-blue-600"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 rounded-[1.5rem] font-black text-white bg-[#1e293b] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
                    >
                        {loading ? <BiLoaderAlt className="animate-spin text-2xl" /> : "Save Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditLecture;