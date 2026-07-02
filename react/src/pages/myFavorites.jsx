import { useSelector } from "react-redux";

export function MyFavorites()
{
    const currentUser = useSelector((state) => state.auth.currentUser);
    const allDresses = useSelector((state) => state.dresses.dresses) || [];
    const userFavoriteIds = currentUser?.favorites || [];

    const myFavoriteDresses = allDresses.filter(dress => 
        userFavoriteIds.includes(dress._id));

    return(
        <div>
            <h2>מועדפים</h2>

            {myFavoriteDresses.length === 0 ?
            ( <p>עדיין לא שמרת שמלות ... עברי לקטלוג כדי להתחיל לבחור!</p> ) : 
            (
                <div>
                    {myFavoriteDresses.map((d) => 
                    (
                        <DressCard key={d._id} dress={d} />
                    ))}
                </div>
            )}
        </div>
    )
}