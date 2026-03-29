// import React, { useState } from 'react';
// import axios from 'axios';
// import Card from '../components/Card';
// import { BiAtom, BiSearchAlt, BiLoaderAlt } from "react-icons/bi";

// const SearchWithAI = () => {
//     const [prompt, setPrompt] = useState("");
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);

//     const handleAISearch = async (e) => {
//         e.preventDefault();
//         if (!prompt.trim()) return;

//         setLoading(true);
//         setHasSearched(true);
//         try {
//             // Calling the Gemini-powered search endpoint
//             const response = await axios.post(
//                 "http://localhost:8000/api/course/search",
//                 { prompt },
//                 { withCredentials: true }
//             );
//             setResults(response.data);
//         } catch (error) {
//             console.error("AI Search Error:", error);
//             setResults([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 pt-[120px] pb-20 px-5 sm:px-10">
//             <div className="max-w-6xl mx-auto">
                
//                 {/* --- AI Header Section --- */}
//                 <div className="flex flex-col items-center text-center mb-12">
//                     <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6 animate-pulse">
//                         <BiBot />
//                     </div>
//                     <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
//                         AI Course Finder <BiAtom className="text-yellow-500" />
//                     </h1>
//                     <p className="text-gray-500 mt-4 max-w-xl text-lg">
//                         Tell us your goals, interests, or career path, and our AI will suggest the perfect courses for you.
//                     </p>
//                 </div>

//                 {/* --- AI Input Form --- */}
//                 <form 
//                     onSubmit={handleAISearch}
//                     className="max-w-3xl mx-auto mb-16 relative group"
//                 >
//                     <input 
//                         type="text" 
//                         placeholder="e.g. 'Help me find a roadmap to become a Full Stack Developer'"
//                         className="w-full px-6 py-5 rounded-2xl border-2 border-gray-100 outline-none focus:border-purple-400 bg-white shadow-xl text-gray-700 transition-all pr-16"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                     />
//                     <button 
//                         type="submit"
//                         disabled={loading}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition-all disabled:bg-gray-400"
//                     >
//                         {loading ? <BiLoaderAlt className="animate-spin text-xl" /> : <BiSearchAlt className="text-xl" />}
//                     </button>
//                 </form>

//                 {/* --- Results Section --- */}
//                 <div className="w-full">
//                     {loading ? (
//                         <div className="flex flex-col items-center justify-center py-20 gap-4">
//                             <BiLoaderAlt className="text-5xl text-purple-600 animate-spin" />
//                             <p className="text-gray-500 font-medium italic">Gemini is curating your personalized roadmap...</p>
//                         </div>
//                     ) : results.length > 0 ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                             {results.map((course) => (
//                                 <Card 
//                                     key={course._id}
//                                     id={course._id}
//                                     thumbnail={course.thumbnail}
//                                     title={course.title}
//                                     category={course.category}
//                                     price={course.price}
//                                     reviews={course.reviews}
//                                 />
//                             ))}
//                         </div>
//                     ) : hasSearched && (
//                         <div className="text-center py-20">
//                             <p className="text-gray-400 italic">No exact matches found. Try describing your goal differently!</p>
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default SearchWithAI;