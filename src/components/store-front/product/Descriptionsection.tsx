// interface DescriptionProps {
//   content: string | null;
// }

// const DescriptionSection = ({ content }: DescriptionProps) => {
//   if (!content)
//     return <p className="text-[#727272]">No description available.</p>;

//   return (
//     <div className="text-[#727272] leading-[1.8] text-base md:text-lg font-poppins">
//       <div
//         className="prose max-w-none prose-p:mb-4 prose-li:list-disc"
//         dangerouslySetInnerHTML={{ __html: content }}
//       />
//     </div>
//   );
// };

// export default DescriptionSection;

interface DescriptionProps {
  content: string | null;
}

const DescriptionSection = ({ content }: DescriptionProps) => {
  if (!content)
    return <p className="text-[#727272]">No description available.</p>;

  return (
    <div className="w-full font-poppins">
      <div
        className="
          prose prose-sm sm:prose-base max-w-none 
          prose-ul:list-disc prose-ul:list-inside
          prose-ol:list-decimal prose-ol:list-inside
          
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:block
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:block
          [&_li]:mb-1 [&_li]:text-[#4A4A4A]
          
          prose-p:text-[#4A4A4A] prose-p:mb-4
          prose-headings:text-black prose-headings:font-bold
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default DescriptionSection;
