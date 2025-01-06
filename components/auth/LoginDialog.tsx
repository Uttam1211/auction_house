import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type LoginDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="space-y-1 text-center"></div>
          <div className={"flex flex-col"}>
            <LoginForm />
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
