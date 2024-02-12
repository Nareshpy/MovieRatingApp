// public int Id { get; set; }
// public string MovieName { get; set; }
// public DateTime ReleaseDate { get; set; }
// public string Category { get; set; }
// public byte[] MoviePoster { get; set; }
export interface Movie{
    id?:number,
    movieName:string,
    releaseDate:Date,
    category :string,
    moviePoster?:string,
    rating?:number
}