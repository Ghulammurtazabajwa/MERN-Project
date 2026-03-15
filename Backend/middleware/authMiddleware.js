export const authenticateAdmin = (req, res, next) => {
  // For simplicity, we are using a hardcoded admin token.
  // In a real application, you would verify a JWT or session.
  const adminToken = req.headers["authorization"];

  if (adminToken === "Bearer admin-secret-token") {
    next(); // User is authenticated as admin, proceed to the next middleware or route handler
  } else {
    res.status(401).json({ message: "Unauthorized: Admin access required" });
  }
};