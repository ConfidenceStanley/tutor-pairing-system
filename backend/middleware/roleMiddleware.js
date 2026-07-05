const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. Students only.");
  }
};

const isTutor = (req, res, next) => {
  if (req.user && req.user.role === "tutor") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. Tutors only.");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }
};

const isStudentOrTutor = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "student" || req.user.role === "tutor")
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied.");
  }
};

module.exports = { isStudent, isTutor, isAdmin, isStudentOrTutor };