import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface SongItemProps {
    number: string;
    title: string;
    theme: string;
    lastPlayed: Date;
    timesPlayedThreeMonths: number;
    onClick: () => void;
}

export default function SongListItem(props: SongItemProps) {
    return (
        <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
            <div>
                <p className="font-medium">{props.title}</p>
                <p className="text-muted-foreground text-sm">
                    {props.theme} | Last played: {props.lastPlayed.toLocaleDateString()} | Times played last three months: {props.timesPlayedThreeMonths}
                </p>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => props.onClick()}
            >
                <Plus />
            </Button>
        </div>
    );
}
