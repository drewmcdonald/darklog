interface RatingPickerProps {
  value: number | null;
  onChange: (rating: number | null) => void;
  max?: number;
}

export function RatingPicker({ value, onChange, max = 5 }: RatingPickerProps) {
  const ratings = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-text-secondary font-medium">Rating</div>
      <div className="flex gap-2">
        {ratings.map(rating => (
          <button
            key={rating}
            type="button"
            className={`w-12 h-12 rounded-full border-2 text-lg font-semibold cursor-pointer transition-all duration-150 ${
              value === rating
                ? 'bg-accent border-accent text-text-primary hover:bg-accent-dim'
                : 'bg-transparent border-border text-text-secondary hover:border-text-secondary hover:text-text-primary'
            }`}
            onClick={() => onChange(value === rating ? null : rating)}
            aria-label={`Rate ${rating} out of ${max}`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}
