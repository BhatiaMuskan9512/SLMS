import React from 'react';
import Hero from '../components/Hero';
import Logos from '../components/Logos';
import ExploreCourses from '../components/ExploreCourses';
import ReviewPage from '../components/ReviewPage';
import Footer from '../components/Footer';
import getAllReviews from '../customHook/getAllReview';
import useGetPublishedCourse from '../customHook/getPublishedCourse';
import Process from './process';
import Marquee from './Marquee';
import CTAStrip from './CTAStrip';


const Home = () => {
    // 1. Trigger Custom Hooks to fetch data as soon as the landing page loads
    // This ensures that ExploreCourses and ReviewPage have data to show.
    getAllReviews();
    useGetPublishedCourse();

    return (
        <div className="w-full min-h-screen bg-white">
            
            {/* --- Hero Section --- */}
            {/* The main banner with the CTA buttons and AI Search intro */}
            <Hero />

            <Marquee/>
            {/* --- Features / Social Proof Section --- */}
            {/* Displays the "AI Search", "Certificates", etc. boxes */}
            <Logos />

            {/* --- Categories Grid --- */}
            {/* The visual grid for Web Dev, AI/ML, UI/UX, etc. */}
            <ExploreCourses />

            <Process />
             

            {/* --- Testimonials / Statistics Section --- */}
            {/* Shows high-rated student reviews and platform stats */}
            <ReviewPage />
             
            <CTAStrip/>

            

        </div>
    );
};

export default Home;