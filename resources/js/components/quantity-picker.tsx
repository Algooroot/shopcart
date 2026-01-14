import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'

interface QuantityPickerProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

const QuantityPicker = ({ 
    quantity, 
    onQuantityChange, 
    min = 0, 
    max = Infinity,
    disabled = false 
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

    return (
        <ButtonGroup>
            <Button
                disabled={disabled || quantity <= min}
                onClick={handleDecrease}
                size="sm"
                variant="outline"
            >
                <MinusIcon />
            </Button>
            <ButtonGroupText className="min-w-12 justify-center">
                {quantity}
            </ButtonGroupText>
            <Button
                disabled={disabled || quantity >= max}
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

