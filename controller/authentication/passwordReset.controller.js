// reset password link mail sender
export const forgotPassword = async (req, res) => {
    res.json({ response: "send reset link" })
}

// update password
export const resetPassword = async (req, res) => {
    res.json({ response: "update password" })
}