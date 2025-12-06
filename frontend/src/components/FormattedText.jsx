import React from 'react';

const FormattedText = ({ content, className = '' }) => {
  // Function to process and format the text content
  const formatText = (text) => {
    if (!text) return [];

    // Split by double line breaks to create paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;

      // Split by single line breaks within paragraphs
      const lines = paragraph.split('\n');
      
      return (
        <div key={pIndex} className={pIndex > 0 ? 'mt-4' : ''}>
          {lines.map((line, lIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            // Check if it's a bullet point
            if (trimmedLine.startsWith('•')) {
              const bulletContent = trimmedLine.substring(1).trim();
              return (
                <div key={lIndex} className="flex items-start gap-2 mb-2">
                  <span className="text-orange-500 mt-1 text-sm">•</span>
                  <span className="flex-1">{formatInlineText(bulletContent)}</span>
                </div>
              );
            }
            
            // Convert any remaining asterisk bullet points to proper bullet points
            if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
              const bulletContent = trimmedLine.substring(1).trim();
              return (
                <div key={lIndex} className="flex items-start gap-2 mb-2">
                  <span className="text-orange-500 mt-1 text-sm">•</span>
                  <span className="flex-1">{formatInlineText(bulletContent)}</span>
                </div>
              );
            }

            // Check if it's a numbered list
            const numberedMatch = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
            if (numberedMatch) {
              return (
                <div key={lIndex} className="flex items-start gap-2 mb-2">
                  <span className="text-orange-500 font-medium min-w-[20px]">{numberedMatch[1]}.</span>
                  <span className="flex-1">{formatInlineText(numberedMatch[2])}</span>
                </div>
              );
            }

            // Regular line
            return (
              <div key={lIndex} className={lIndex > 0 ? 'mt-2' : ''}>
                {formatInlineText(trimmedLine)}
              </div>
            );
          })}
        </div>
      );
    }).filter(Boolean);
  };

  // Function to format inline text (bold, emojis, etc.)
  const formatInlineText = (text) => {
    if (!text) return '';

    // Split by bold markers **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      // Check if it's bold text
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {boldText}
          </strong>
        );
      }
      
      // Regular text
      return <span key={index}>{part}</span>;
    });
  };

  const formattedContent = formatText(content);

  return (
    <div className={`leading-relaxed ${className}`}>
      {formattedContent}
    </div>
  );
};

export default FormattedText;