import { FC } from "react";
import styled, { keyframes } from "styled-components";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

// ─── Enhanced Card Container ──────────────────────────────────────────────────

const EnhancedTourCardBase = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  transition: all 0.3s ease;
  animation: ${fadeIn} 0.4s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  @media (max-width: 768px) {
    border-radius: var(--border-radius-md);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: box-shadow 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`;

// ─── Hero Image with Gradient Overlay ─────────────────────────────────────────

const HeroImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20rem;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--color-grey-100) 0%,
    var(--color-grey-200) 100%
  );

  @media (max-width: 768px) {
    height: 16rem;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  ${EnhancedTourCardBase}:hover & {
    transform: scale(1.05);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${EnhancedTourCardBase}:hover & {
      transform: none;
    }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );

  opacity: 0;
  transition: opacity 0.3s ease;

  ${EnhancedTourCardBase}:hover & {
    opacity: 1;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    90deg,
    var(--color-grey-100) 0%,
    var(--color-grey-200) 50%,
    var(--color-grey-100) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;

  svg {
    width: 4rem;
    height: 4rem;
    color: var(--color-grey-400);
  }
`;

// ─── Glassmorphism Quick Actions ──────────────────────────────────────────────

const QuickActions = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;

  display: flex;
  gap: 0.8rem;

  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${EnhancedTourCardBase}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    opacity: 1;
    transform: translateY(0);
  }
`;

const QuickActionButton = styled.button`
  padding: 0.8rem;

  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-md);

  box-shadow: var(--shadow-md);

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-800);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease;
    &:hover {
      transform: none;
    }
    &:active {
      transform: none;
    }
  }
`;

// ─── Rating Badge ─────────────────────────────────────────────────────────────

const RatingBadge = styled.div`
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;

  padding: 0.6rem 1rem;

  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-lg);

  display: flex;
  align-items: center;
  gap: 0.4rem;

  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-900);

  box-shadow: var(--shadow-md);

  span {
    color: #f59e0b; /* Amber/gold for star */
  }
`;

// ─── Card Content ─────────────────────────────────────────────────────────────

const CardContent = styled.div`
  padding: 1.6rem;

  @media (max-width: 768px) {
    padding: 1.4rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-grey-900);
  line-height: 1.3;
  margin: 0 0 0.8rem;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  font-size: 1.4rem;
  color: var(--color-grey-600);

  span:first-child {
    font-size: 1.6rem;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

// ─── Key Metrics Grid ─────────────────────────────────────────────────────────

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  padding: 1.2rem 0;
  border-top: 1px solid var(--color-grey-200);
  border-bottom: 1px solid var(--color-grey-200);

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;

  padding: 1rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);

  transition: all 0.2s ease;

  &:hover {
    background: var(--color-brand-50);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 0.6rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

const MetricLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const MetricValue = styled.span<{ $highlight?: boolean }>`
  font-size: 1.7rem;
  font-weight: 700;
  color: ${(p) =>
    p.$highlight ? "var(--color-brand-600)" : "var(--color-grey-900)"};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// ─── Status Badges ────────────────────────────────────────────────────────────

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
`;

const StatusBadge = styled.span<{
  $variant: "available" | "almostFull" | "soldOut" | "category";
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  padding: 0.4rem 1.2rem;
  border-radius: var(--border-radius-lg);

  font-size: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${(p) => {
    switch (p.$variant) {
      case "available":
        return `
          background: var(--color-success-light);
          color: var(--color-success-dark);
        `;
      case "almostFull":
        return `
          background: #fff8e1; /* warning light */
          color: #b8843b; /* warning dark */
        `;
      case "soldOut":
        return `
          background: var(--color-danger-light);
          color: var(--color-danger-dark);
        `;
      case "category":
        return `
          background: var(--color-brand-100);
          color: var(--color-brand-700);
        `;
      default:
        return `
          background: var(--color-grey-100);
          color: var(--color-grey-800);
        `;
    }
  }}

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.3rem 1rem;
  }
`;

// ─── Action Buttons ───────────────────────────────────────────────────────────

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;

  @media (max-width: 768px) {
    gap: 0.6rem;
  }
`;

const ActionButton = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  padding: 1rem;
  min-height: 4.4rem;

  border: 2px solid transparent;
  border-radius: var(--border-radius-md);

  font-size: 1.4rem;
  font-weight: 500;
  font-family: inherit;

  cursor: pointer;
  transition: all 0.2s ease;

  ${(p) => {
    switch (p.$variant) {
      case "primary":
        return `
          background: var(--color-brand-500);
          color: var(--color-grey-0);
          &:hover { 
            background: var(--color-brand-600); 
            transform: translateY(-1px); 
            box-shadow: var(--shadow-md);
          }
          &:active {
            background: var(--color-brand-700);
            transform: translateY(0);
          }
        `;
      case "secondary":
        return `
          background: transparent;
          color: var(--color-brand-500);
          border-color: var(--color-brand-500);

          svg {
            color: var(--color-brand-500);
          }

          &:hover { 
            background: var(--color-brand-500); 
            color: var(--color-grey-0);
            transform: translateY(-1px); 
            box-shadow: var(--shadow-md);

            svg {
              color: var(--color-grey-0);
            }
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case "danger":
        return `
          background: var(--color-danger-base);
          color: var(--color-grey-0);
          &:hover { 
            background: var(--color-danger-dark); 
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.9rem 0.8rem;

    span {
      display: none; // Hide text on small screens, show only icons
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      color 0.2s ease;
    &:hover {
      transform: none;
    }
    &:active {
      transform: none;
    }
  }
`;

// ─── Component Types ──────────────────────────────────────────────────────────

interface EnhancedTourCardProps {
  tour: {
    id: string;
    name: string;
    city: string;
    price: number;
    availability: number;
    capacity: number;
    imageUrl?: string;
    rating?: number;
    reviewCount?: number;
    category?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onQuickView: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const EnhancedTourCard: FC<EnhancedTourCardProps> = ({
  tour,
  onEdit,
  onDelete,
  onQuickView,
}) => {
  const availabilityPercentage = (tour.availability / tour.capacity) * 100;

  const getAvailabilityStatus = (): "available" | "almostFull" | "soldOut" => {
    if (availabilityPercentage === 0) return "soldOut";
    if (availabilityPercentage <= 25) return "almostFull";
    return "available";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <EnhancedTourCardBase>
      {/* Hero Image */}
      <HeroImageContainer>
        {tour.imageUrl ? (
          <>
            <HeroImage src={tour.imageUrl} alt={tour.name} loading="lazy" />
            <ImageOverlay />
          </>
        ) : (
          <ImagePlaceholder>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </ImagePlaceholder>
        )}

        {/* Rating Badge */}
        {tour.rating && (
          <RatingBadge>
            <span>⭐</span>
            {tour.rating}
            {tour.reviewCount && ` (${tour.reviewCount})`}
          </RatingBadge>
        )}

        {/* Quick Actions (Glassmorphism) */}
        <QuickActions>
          <QuickActionButton onClick={onQuickView} aria-label="Quick view">
            <EyeIcon />
          </QuickActionButton>
        </QuickActions>
      </HeroImageContainer>

      {/* Card Content */}
      <CardContent>
        <CardTitle>{tour.name}</CardTitle>

        <CardMeta>
          <MetaItem>
            <span>📍</span>
            {tour.city}
          </MetaItem>
        </CardMeta>

        {/* Key Metrics */}
        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Price</MetricLabel>
            <MetricValue $highlight>{formatPrice(tour.price)}</MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Max</MetricLabel>
            <MetricValue>{tour.capacity}</MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Available</MetricLabel>
            <MetricValue>{tour.availability}</MetricValue>
          </MetricCard>
        </MetricsGrid>

        {/* Status Badges */}
        <BadgeContainer>
          <StatusBadge $variant={getAvailabilityStatus()}>
            {getAvailabilityStatus() === "available" && "⚡ Available"}
            {getAvailabilityStatus() === "almostFull" && "🔥 Almost Full"}
            {getAvailabilityStatus() === "soldOut" && "❌ Sold Out"}
          </StatusBadge>

          {tour.category && (
            <StatusBadge $variant="category">🎒 {tour.category}</StatusBadge>
          )}
        </BadgeContainer>

        {/* Action Buttons */}
        <ActionButtons>
          <ActionButton $variant="secondary" onClick={onEdit}>
            <PencilIcon />
            <span>Edit</span>
          </ActionButton>

          <ActionButton $variant="danger" onClick={onDelete}>
            <TrashIcon />
            <span>Delete</span>
          </ActionButton>

          <ActionButton $variant="primary" onClick={onQuickView}>
            <EyeIcon />
            <span>View</span>
          </ActionButton>
        </ActionButtons>
      </CardContent>
    </EnhancedTourCardBase>
  );
};

export default EnhancedTourCard;
