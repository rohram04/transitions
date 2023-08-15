USE

CREATE TABLE Users (
	spotifyId TEXT PRIMARY key,
	displayName TEXT
);

CREATE TABLE Transitions (
	id SERIAL PRIMARY KEY,
	userId TEXT REFERENCES Users (spotifyId), 
	trackId1 VARCHAR(62),
	trackId2 VARCHAR(62),
	startTime INT,
	enhanced text,
	date TIMESTAMP,
);

CREATE TABLE Likes (
	userId TEXT,
	transitionId INTEGER REFERENCES Transitions (id),
	PRIMARY KEY (userId, transitionId)
);

CREATE TABLE Comments (
	id SERIAL PRIMARY KEY,
	userId TEXT REFERENCES Users (spotifyId),
	TransitionId INTEGER REFERENCES Transitions (id),
	comment TEXT
);

insert into likes (userId, transitionId) values (1, 7);

select * from likes ;

SELECT * from transitions ;

alter table transitions add column date timestamp;
select "id", "transitions"."userid", "trackid1", "trackid2", "starttime", "enhanced", count("transitionid") as likes, count(CASE when likes.userid = '31ir266ygs472yyiqiv2xsfe4nre' then 1 else null end) as liked from "transitions" inner join "users" on "users"."spotifyid" = "transitions"."userid" left join "likes" on "likes"."transitionid" = "transitions"."id" group by "id";