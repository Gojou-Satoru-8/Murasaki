import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notesActions } from "../store";

const usePopulateNotes = () => {
  const dispatch = useDispatch();
  const notesState = useSelector((state) => state.notes);
  console.log(notesState);

  useEffect(() => {
    const fetchAllNotes = async () => {
      const response = await fetch("http://localhost:3000/notes", { credentials: "include" });
      const data = await response.json();
      console.log(data);

      if (response.status === 404) return;
      dispatch(notesActions.setNotes({ notes: data.notes }));
    };
    fetchAllNotes();
  }, [dispatch]);
};

export default usePopulateNotes;
