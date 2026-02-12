'use client';

import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function AddOrderButton({ action }: { action: () => Promise<void> }) {
    return (
        <form action={action}>
            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant="primary"
            isPending={pending}
        >
            {!pending && <Plus size={20} className="mr-2" />}
            New Order (Test)
        </Button>
    );
}
