import { Info, Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';

interface SongItemProps {
    number: string;
    title: string;
    theme: string;
    lastPlayed: Date;
    timesPlayedThreeMonths: number;
    onClick: () => void;
    // Extended info for modal (optional)
    totalPlays?: number;
    averagePerMonth?: number;
    firstPlayed?: Date;
    recentPlays?: Date[];
    tempo?: string;
    duration?: string;
    scriptureRefs?: string[];
    categories?: string[];
    composer?: string;
    trending?: 'up' | 'down' | 'stable';
}

export default function SongListItem(props: SongItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getTrendingColor = (trending: string) => {
        switch (trending) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTrendingIcon = (trending: string) => {
        switch (trending) {
            case 'up':
                return '↗️';
            case 'down':
                return '↘️';
            default:
                return '➡️';
        }
    };

    return (
        <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
            <div className="flex-1">
                <p className="font-medium">
                    {props.number} - {props.title}
                </p>
                <p className="text-muted-foreground text-sm">
                    {props.theme} | Last played: {props.lastPlayed.toLocaleDateString()} | Times played last three months: {props.timesPlayedThreeMonths}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Dialog
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {props.number} - {props.title}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h3 className="font-semibold mb-2">Song Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Theme:</span>
                                        <p className="font-medium">{props.theme}</p>
                                    </div>
                                    {props.composer && (
                                        <div>
                                            <span className="text-muted-foreground">Composer:</span>
                                            <p className="font-medium">{props.composer}</p>
                                        </div>
                                    )}
                                    {props.tempo && (
                                        <div>
                                            <span className="text-muted-foreground">Tempo:</span>
                                            <p className="font-medium">{props.tempo}</p>
                                        </div>
                                    )}
                                    {props.duration && (
                                        <div>
                                            <span className="text-muted-foreground">Duration:</span>
                                            <p className="font-medium">{props.duration}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Usage Statistics */}
                            <div>
                                <h3 className="font-semibold mb-3">Usage Statistics</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-2xl font-bold">{props.totalPlays ?? 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">Total Plays</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-2xl font-bold">{props.timesPlayedThreeMonths}</p>
                                        <p className="text-xs text-muted-foreground">Last 3 Months</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-2xl font-bold">{props.averagePerMonth ?? 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">Avg/Month</p>
                                    </div>
                                </div>

                                {props.trending && (
                                    <div className="mt-3 flex items-center justify-center">
                                        <span className={`flex items-center gap-1 text-sm ${getTrendingColor(props.trending)}`}>
                                            {getTrendingIcon(props.trending)}
                                            Trending {props.trending}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Play History */}
                            <div>
                                <h3 className="font-semibold mb-3">Play History</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Last Played:</span>
                                        <p className="font-medium">{props.lastPlayed.toLocaleDateString()}</p>
                                    </div>
                                    {props.firstPlayed && (
                                        <div>
                                            <span className="text-muted-foreground">First Played:</span>
                                            <p className="font-medium">{props.firstPlayed.toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>

                                {props.recentPlays && props.recentPlays.length > 0 && (
                                    <div className="mt-3">
                                        <span className="text-muted-foreground text-sm">Recent Plays:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {props.recentPlays.slice(0, 10).map((date, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Categories and Scripture */}
                            {(props.categories?.length ?? props.scriptureRefs?.length) && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-3">Additional Info</h3>

                                        {props.categories && props.categories.length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-muted-foreground text-sm">Categories:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {props.categories.map((category, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                        >
                                                            {category}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {props.scriptureRefs && props.scriptureRefs.length > 0 && (
                                            <div>
                                                <span className="text-muted-foreground text-sm">Scripture References:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {props.scriptureRefs.map((ref, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                        >
                                                            {ref}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => props.onClick()}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
