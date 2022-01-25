import {FC} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Typography
} from "@mui/material";

export interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
}

const AboutDialog: FC<AboutDialogProps> = ({open, onClose}) => {
    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>About Hours</DialogTitle>
    <DialogContent>
        <Stack spacing={2.5} my={1}>
            <Typography>
            Hours was created at Brown University to facilitate office hours for courses in the CS Department and beyond.
            </Typography>
        </Stack>
    </DialogContent>
    </Dialog>;
};

export default AboutDialog;


