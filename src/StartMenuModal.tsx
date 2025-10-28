import { Box, Modal } from "@mui/material"
import { useContext, useState } from "react"
import { PauseContext } from "./App";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

export const StartMenuModal = () => {
    const [open, setOpen] = useState(true);
    const {setPaused} = useContext(PauseContext);

    const start = () => {
        setPaused(false);
        setOpen(false);
    }

    return (
        <Modal
            open={open}
        >
            <Box sx={modalStyle}>
                <h3>Tetris++</h3>
                <button onClick={start}>Start!</button>
            </Box>
        </Modal>
    );
}