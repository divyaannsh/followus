export default function (){

    const templateSpecial = [
        {id:1,bgImage:""},
        {id:2,bgImage:""},
        {id:3,bgImage:""},
    ]
    return (
        <div className="flex justify-center items-center border-2  min-h-screen">
            <div className="border-2 grid grid-cols-4 max-w-5xl">
             {templateSpecial.map((itm)=>(
                <div key={itm.id}>
                    
                </div>
             ))}
            </div>
        </div>
    )
}