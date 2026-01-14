import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'

interface QuantityPickerProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    onDelete?: () => void;
    showDeleteIcon?: boolean;
    isLoading?: boolean;
}

const QuantityPicker = ({ 
    quantity, 
    onQuantityChange, 
    min = 0, 
    max = Infinity,
    disabled = false,
    onDelete,
    showDeleteIcon = false,
    isLoading = false
}: QuantityPickerProps) => {
    const handleDecrease = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
    };

    const isQuantityOne = quantity === 1 && showDeleteIcon;

    return (
        <ButtonGroup>
            <Button
                disabled={disabled || isLoading || (quantity <= min && !isQuantityOne)}
                onClick={isQuantityOne ? handleDelete : handleDecrease}
                size="sm"
                variant="outline"
                className={isQuantityOne ? "text-destructive hover:text-destructive" : ""}
            >
                {isQuantityOne ? (
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        width="16" 
                        height="16" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path fill="none" d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                ) : (
                    <MinusIcon />
                )}
            </Button>
            <ButtonGroupText className="min-w-12 justify-center">
                {isLoading ? (
                    <Spinner className="h-4 w-4" />
                ) : (
                    quantity
                )}
            </ButtonGroupText>
            <Button
                disabled={disabled || isLoading || quantity >= max}
                onClick={handleIncrease}
                size="sm"
                variant="outline"
            >
                <PlusIcon />
            </Button>
        </ButtonGroup>
    );
};

export default QuantityPicker;

