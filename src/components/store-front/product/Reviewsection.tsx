"use client";

import { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ViewIcon from "../svg/ViewIcon";
import RatingBarRow from "./RatingBarRow";
import StarRatingInput from "./StarRatingInput";
import ReviewItem from "./ReviewItem";
import {
  getReviewsByProduct,
  createReview,
  uploadReviewImages,
} from "@/services-api/reviewService";

interface ReviewUser {
  name: string;
  avatar?: string | null;
}

interface Review {
  id: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  images: string[];
  name: string;
  is_verified: boolean;
  avatar?: string | null;
  created_at?: string;
}

interface RatingStat {
  rating: number;
  _count: {
    rating: number;
  };
}

interface ReviewApiResponse {
  success: boolean;
  data: {
    reviews: Review[];
    ratingStats: RatingStat[];
  };
}

const ReviewSection = ({ productId }: { productId: string }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Fetch Reviews ---
  const { data, isLoading } = useQuery<ReviewApiResponse>({
    queryKey: ["reviews", productId],
    queryFn: () => getReviewsByProduct(productId),
    enabled: !!productId,
  });

  // --- Create Review Mutation ---
  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Review submitted successfully!");
        setComment("");
        setName("");
        setPhoneNumber("");
        setEmail("");
        setRating(5);
        setSelectedFiles([]);
        queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      }
    },
    onError: (err: Error) => toast.error(err.message || "Failed to submit"),
  });

  // --- Handle File Selection ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // --- Submit Function with Validation ---
  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Please enter your name");
    if (!phoneNumber.trim())
      return toast.error("Please enter your phone number");
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    const sanitizedPhone = phoneNumber.replace(/\s/g, "");

    if (!bdPhoneRegex.test(sanitizedPhone)) {
      return toast.error("Please enter a valid Bangladeshi phone number");
    }

    if (!comment.trim()) return toast.error("Please write a comment");

    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];

      // 2. Upload images first if selected
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("images", file));

        const uploadRes = await uploadReviewImages(formData);
        if (uploadRes.success) {
          // Extract URLs from the response
          imageUrls = uploadRes?.data.data;
        }
      }

      // 3. Submit final review data
      await createMutation.mutateAsync({
        productId,
        rating,
        comment,
        name,
        phoneNumber: sanitizedPhone,
        email,
        images: imageUrls,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Process failed, try again";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Stats Calculations ---
  const reviews = data?.data?.reviews || [];
  const ratingStats = data?.data?.ratingStats || [];

  const totalReviews = ratingStats.reduce(
    (acc: number, curr: RatingStat) => acc + curr._count.rating,
    0,
  );

  const avgRating =
    totalReviews > 0
      ? (
          ratingStats.reduce(
            (acc: number, curr: RatingStat) =>
              acc + curr.rating * curr._count.rating,
            0,
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const ratingCounts: Record<number, number> = {};
  ratingStats.forEach((s: RatingStat) => {
    ratingCounts[s.rating] = s._count.rating;
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="font-poppins">
      {/* --- Stats Header --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
        <div>
          <h2 className="md:text-[28px] text-[24px] font-semibold text-black mb-1">
            Customer Review
          </h2>
          <p className="text-[#727272] text-[16px] md:text-[20px] max-w-[416px]">
            See what clients say about us.
          </p>
        </div>
        <div className="text-center shrink-0">
          <div className="text-[64px] font-semibold text-[#FF7050] leading-none mb-2">
            {avgRating}
          </div>
          <div className="flex justify-center text-[#FDCC0D] text-2xl gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(Number(avgRating))
                    ? "text-[#FDCC0D]"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
          <p className="text-[#8C8C8C] text-base">{totalReviews} Reviews</p>
        </div>
        <div className="flex-1 w-full max-w-xs space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBarRow
              key={star}
              star={star}
              count={ratingCounts[star] || 0}
              total={totalReviews}
            />
          ))}
        </div>
      </div>

      {/* --- Review List --- */}
      <div className="space-y-8 pt-14">
        {reviews.length > 0 ? (
          reviews.map((rev: Review) => (
            <ReviewItem
              key={rev.id}
              name={rev.user?.name || rev.name}
              avatar={rev.user?.avatar}
              rating={rev.rating}
              comment={rev.comment}
              images={rev.images || []}
              is_verified={rev.is_verified}
              date={rev.created_at}
            />
          ))
        ) : (
          <p className="text-gray-400 italic">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {/* --- Submit Form --- */}
      <div className="pt-20">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[24px] font-semibold text-black">
              Submit Your Review
            </h2>
            <p className="text-[#727272]">
              Share your amazing experience with us!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#727272] font-semibold">Rating</span>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="flex flex-col">
              <label className="text-black font-semibold mb-3">Name*</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="bg-[#F9F9F9] border border-[#D2D2D2] rounded-[12px] py-5 px-5 outline-none focus:border-[#FF7050]"
              />
            </div>
            {/* Number Input */}
            <div className="flex flex-col">
              <label className="text-black font-semibold mb-3">Number*</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="bg-[#F9F9F9] border border-[#D2D2D2] rounded-[12px] py-5 px-5 outline-none focus:border-[#FF7050]"
              />
            </div>
          </div>

          {/* Review Textarea */}
          <div className="flex flex-col">
            <label className="text-black font-semibold mb-3">Review*</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type your review here"
              className="flex-1 bg-[#F9F9F9] border border-[#D2D2D2] rounded-[12px] p-6 outline-none focus:border-[#FF7050] min-h-[174px] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-5 md:flex-row flex-col mt-8">
          {/* Email Input */}
          <div className="flex flex-col md:w-1/2 w-full">
            <label className="text-black font-semibold mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="bg-[#F9F9F9] border border-[#D2D2D2] rounded-[12px] py-5 px-5 outline-none focus:border-[#FF7050]"
            />
          </div>

          <div className="flex md:w-1/2 w-full gap-3 mt-auto relative">
            {/* Hidden File Input */}
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />

            {/* ViewIcon triggers upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2.5 border-[#FF7050] border w-fit rounded-[12px] relative transition-colors ${selectedFiles.length > 0 ? "bg-orange-100" : ""}`}
            >
              <ViewIcon />
              {selectedFiles.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF7050] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {selectedFiles.length}
                </span>
              )}
            </button>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#FF7050] rounded-[12px] text-xl font-semibold uppercase text-white py-4 disabled:bg-gray-400 transition-all active:scale-95"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
