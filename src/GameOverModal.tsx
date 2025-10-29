import { Box, Modal } from "@mui/material"

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

type GameOverProps = {
    open: boolean;
    restart: () => void
}

export const GameOverModal = ({open, restart}: GameOverProps) => {

    return (
        <Modal
            open={open}
        >
            <Box sx={modalStyle}>
                <h3>GAME OVER</h3>
                <button onClick={restart}>Play Again?</button>
            </Box>
        </Modal>
    );
}