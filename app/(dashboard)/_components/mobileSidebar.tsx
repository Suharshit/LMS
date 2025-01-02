import { Menu } from "lucide-react"
import {
    Sheet, 
    SheetContent,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import VisuallyHidden from "@/components/ui/visuallyHidden";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu/>
            </SheetTrigger>
            <VisuallyHidden>
                <SheetTitle>hidden just for not shown error purpose</SheetTitle>
            </VisuallyHidden>
            <SheetContent side="left" className="p-0 bg-white">
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}