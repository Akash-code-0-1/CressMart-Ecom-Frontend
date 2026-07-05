"use client";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  const faqData = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, browse our products, add your desired items to the cart, and proceed to checkout. Fill in your shipping details and choose a payment method to complete the process.",
    },
    {
      question: "How long does it take to confirm an order?",
      answer:
        "Orders are typically confirmed within 1-2 hours during business hours. You will receive a confirmation SMS or email once your order is processed.",
    },
    {
      question: "How many days does delivery take?",
      answer:
        "Delivery charges are [60 TK] inside Dhaka and [120 TK] outside Dhaka. (Note: Free delivery available on orders above [2000 TK]). Typically takes 1-3 business days.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery charges are [60 TK] inside Dhaka and [120 TK] outside Dhaka. Free delivery is provided for orders over 2000 TK.",
    },
    {
      question: "Which courier service do you use?",
      answer:
        "We partner with reliable nationwide courier services like Pathao, Steadfast, and RedX to ensure your products reach you safely and on time.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full px-4 md:px-10 bg-white font-poppins">
      <div className="max-w-full">
        {/* Title */}
        <h2 className="text-center text-black text-[28px] md:text-[32px] font-semibold mb-12">
          Frequently Asking Questions
        </h2>

        {/* FAQ List */}
        <div className="flex flex-col gap-5">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`
                rounded-[8px] transition-all duration-300 ease-in-out
                ${
                  openIndex === index
                    ? "bg-[#EBEBEB] shadow-none"
                    : "bg-white shadow-[0px_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0px_4px_20px_rgba(0,0,0,0.08)]"
                }
              `}
            >
              {/* Question Header */}
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex justify-between items-center p-5 md:p-6 text-left cursor-pointer"
              >
                <span className="text-black text-[16px] md:text-[18px] font-semibold">
                  {item.question}
                </span>
                <FiChevronDown
                  className={`text-[24px] text-[#727272] transition-transform duration-300 ease-in-out ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Answer Content */}
              <div
                className={`
                  grid transition-all duration-300 ease-in-out px-5 md:px-6
                  ${
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100 pb-6"
                      : "grid-rows-[0fr] opacity-0 pb-0"
                  }
                `}
              >
                <div className="overflow-hidden">
                  <p className="text-[#585858] text-[14px] md:text-[15px] leading-relaxed font-normal">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
