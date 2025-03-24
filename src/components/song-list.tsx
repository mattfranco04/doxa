"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "~/components/ui/button";
import { GripVertical, X } from "lucide-react";
import type { Song } from "~/lib/types";

interface SongItemProps {
  song: Song;
  index: number;
  onRemove: (index: number) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemType = "SONG";

const SongItem = ({ song, index, onRemove, onMove }: SongItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemType,
    item: { index, id: song.id, type: ItemType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={dragPreview}
      className={`mb-2 flex items-center rounded-md border p-3 ${isDragging ? "opacity-50" : ""}`}
    >
      <div ref={ref} className="mr-2 cursor-move">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{song.title}</div>
        <div className="text-sm text-muted-foreground">
          #{song.number} • {song.category}
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove(index)}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Remove song</span>
      </Button>
    </div>
  );
};

interface SongListProps {
  songs: Song[];
  onRemove: (index: number) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

export default function SongList({ songs, onRemove, onMove }: SongListProps) {
  return (
    <div>
      {songs.length > 0 ? (
        <div>
          {songs.map((song, index) => (
            <SongItem
              key={`${song.id}-${index}`}
              song={song}
              index={index}
              onRemove={onRemove}
              onMove={onMove}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border py-8 text-center">
          <p className="text-muted-foreground">No songs added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the song library on the right to add songs
          </p>
        </div>
      )}
    </div>
  );
}
