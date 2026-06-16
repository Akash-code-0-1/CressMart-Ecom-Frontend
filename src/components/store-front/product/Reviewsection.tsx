"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import ViewIcon from "../svg/ViewIcon";
import RatingBarRow from "./RatingBarRow";
import StarRatingInput from "./StarRatingInput";
import ReviewItem from "./ReviewItem";

const ReviewSection = () => {
  const [rating, setRating] = useState(5);

  const ratingCounts: Record<number, number> = { 5: 4, 4: 2, 3: 0, 2: 0, 1: 1 };
  const totalReviews = Object.values(ratingCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="font-poppins">
      {/* Review Header Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
        {/* Title */}
        <div className="">
          <h2 className="md:text-[28px] text-[24px] font-semibold text-black mb-1">
            Customer Review
          </h2>
          <p className="text-[#727272] text-[16px] md:text-[20px] max-w-[416px] leading-snug">
            See what clients say about their amazing experiences with us.
          </p>
        </div>

        {/* Overall Rating */}
        <div className="text-center shrink-0">
          <div className="text-[64px] font-semibold text-[#FF7050] leading-none mb-2">
            5.0
          </div>
          <div className="flex justify-center text-[#FDCC0D] text-2xl gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p className="text-[#8C8C8C] text-base">{totalReviews} Reviews</p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 w-full max-w-xs space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBarRow
              key={star}
              star={star}
              count={ratingCounts[star] ?? 0}
              total={totalReviews}
            />
          ))}
        </div>
      </div>

      {/* ── Reviews List ── */}
      <div className="space-y-8 pt-14">
        <ReviewItem
          name="Imam Hoshen"
          rating={5}
          comment="I am glad to receive this product due to their best quality. A great watch with this budget"
        />
        <ReviewItem
          name="Liam Carter"
          rating={4}
          comment="Really impressed with the craftsmanship of this watch. It offers excellent value and style for the price, making it a smart buy."
          hasImage
        />
        <ReviewItem
          name="Md. Al Alamin"
          rating={5}
          comment="The watch exceeded my expectations with its durability and design. Perfect for everyday wear without breaking the bank."
        />
      </div>

      {/* ── Submit Review Form ── */}
      <div className="pt-20">
        {/* Form Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[24px] font-semibold text-black mb-1">
              Submit Your Review
            </h2>
            <p className="text-[#727272] md:text-base text-sm max-w-[410px]">
              Share your amazing experience with us by submitting a review!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base md:text-[24px] font-semibold text-[#727272]">
              Rating
            </span>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name Input */}
            <div className="flex flex-col">
              <label className="text-black font-poppins text-base font-semibold mb-3">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type your Name Here"
                className="w-full bg-[#F9F9F9] border-[1.5px] border-[#D2D2D2] rounded-[12px] py-5 px-5 text-base font-poppins font-normal text-black placeholder:text-[#D2D2D2] outline-none focus:border-[#FF7050] transition-all"
              />
            </div>

            {/* Number Input */}
            <div className="flex flex-col">
              <label className="text-black font-poppins text-base font-semibold mb-3">
                Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type your Name Here"
                className="w-full bg-[#F9F9F9] border-[1.5px] border-[#D2D2D2] rounded-[12px] py-5 px-5 text-base font-poppins font-normal text-black placeholder:text-[#D2D2D2] outline-none focus:border-[#FF7050] transition-all"
              />
            </div>

            {/* Email Input */}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <label className="text-black font-poppins text-base font-semibold mb-3">
              Review<span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Type your review here"
              className="flex-1 w-full bg-[#F9F9F9] border-[1.5px] border-[#D2D2D2] rounded-[12px] p-[24px] text-[16px] font-poppins font-normal text-black placeholder:text-[#D2D2D2] outline-none focus:border-[#FF7050] transition-all min-h-[174px] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-5 md:flex-row flex-col">
          <div className="flex flex-col mt-3 md:w-1/2 w-full">
            <label className="text-black font-poppins text-base font-semibold mb-3">
              Email
            </label>
            <input
              type="text"
              placeholder="Type your Name Here"
              className="w-full bg-[#F9F9F9] border-[1.5px] border-[#D2D2D2] rounded-[12px] py-5 px-5 text-base font-poppins font-normal text-black placeholder:text-[#D2D2D2] outline-none focus:border-[#FF7050] transition-all"
            />
          </div>

          <div className="flex md:w-1/2 w-full gap-3 mt-auto">
            <button className="cursor-pointer p-2.5 border-[#FF7050] border w-fit rounded-[12px]">
              <ViewIcon />
            </button>

            <button className="w-full bg-[#FF7050] rounded-[12px] text-xl font-poppins font-semibold uppercase cursor-pointer text-white">
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
