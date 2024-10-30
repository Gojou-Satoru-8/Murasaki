import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions, notesActions } from "../store";
import { useNavigate } from "react-router-dom";

const usePopulateNotes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notesState = useSelector((state) => state.notes);
  // console.log(notesState);

  useEffect(() => {
    const fetchAllNotes = async () => {
      const response = await fetch("http://localhost:3000/notes", { credentials: "include" });
      const data = await response.json();

      // For unauthorized errors:
      if (response.status === 401) {
        // navigate("/log-in", { state: { message: "Time Out! Please log-in again" } });
        dispatch(authActions.unsetUser());
        dispatch(notesActions.clearAll());
        navigate("/log-in");
        return;
        // NOTE: usePopulateNotes hook follows the RedirectIfNotAuthenticated Hook, which means that if this hook runs,
        // at the home page, then the user is authenticated. This if check is mainly used for the case when
        // cookie was deliberately deleted.
      }
      // else if (!response.ok) alert("Failed to populate notes"); // For all other errors:

      if (response.status === 404) {
        console.warn("No notes found:", data.message);
        // dispatch(notesActions.clearAll()); // Or just below works since notes are already empty array []
        dispatch(notesActions.clearSelectedTags());
        return;
      }

      dispatch(notesActions.setNotes({ notes: data.notes }));
      // Issue of data.notes turning to undefined needs to be isolated
    };
    fetchAllNotes();
  }, [dispatch, navigate]);
  return notesState;
};

export default usePopulateNotes;
