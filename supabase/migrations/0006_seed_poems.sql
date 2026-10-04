-- Seed the seven poems supplied by Aashi. The slug conflict guard makes this
-- content seed safe to re-run without duplicating published poems.
insert into public.poems (
    title, slug, excerpt, content, status, published_at, tags, sort_order
)
values
    (
        'Tell him I miss me.',
        'tell-him-i-miss-me',
        'I will sit on my bedroom floor\nAnd mourn every soul I''ve loved,\nRead through all the patterns\nWalk through every word I''ve said.',
        $poem_1$
I will sit on my bedroom floor
And mourn every soul I've loved,
Read through all the patterns
Walk through every word I've said.
The walls will seem loud
The echoes will stand tall,
My old perfume stares at me
As the breathless roses take their fall.
The silent kisses near the door
And the almost hugs on the staircase.
I try to step out of this cage
But your lingering ghost stops me halfway.
Shadows of us standing here
Try to join the leftover parts of me and you,
Every glance and every touch
What we never saw, was still seen by few.
The laughs that we shared
and the tears that fell right after,
It’ll never see the light outside
And your false control will one day shatter.
$poem_1$,
        'published', now(), '[]'::jsonb, 0
    ),
    (
        'Crossing in silence.',
        'crossing-in-silence',
        'I cross the road vaguely\nnot towards a place,\nnot away from one either.',
        $poem_2$
I cross the road vaguely
not towards a place,
not away from one either.
I've been lost a countless times
in this city
with its not so sanguine weather.
The sunlight shines through cracks of buildings,
casting its golden glow
after a cold stormy evening.
There's a stranger across from me
in the corner and there
just like me, and I wonder if they've too
once experienced this feeling.
My shadow moves ahead of me
as if it already knows the way.
I don't want this life to be another thing
that I just one day throw away.
The cars don't seem to rush today,
and time seems to pass slowly.
I look at the stranger ahead of me once again
and I start to wonder
If every other they also feel quite lonely.
Maybe it's better if we never speak.
Never trade these thoughts and stories,
But only carry them home like unfinished memories.
$poem_2$,
        'published', now(), '[]'::jsonb, 1
    ),
    (
        'Deferred becoming.',
        'deferred-becoming',
        'Enter the place.\nLooking around in awe.\nI never imagined a world like this,',
        $poem_3$
Enter the place.
Looking around in awe.
I never imagined a world like this,
I realized wanting more was never a flaw.

With books floating around,
Some old and dusty,
Some new, their pages freshly bound.
The shelves felt almost gregarious,
Crowded with stories, layered and profound.
and one looked quite familiar,
Why wouldn't it?
My hands reach for it and my legs tremble,
After discovering what I've found.

It had my name written in cursive,
With the faint smell of my perfume,
Which I haven't used in a while.
My mind doesn't dare to think,
What all I had written there,
And what lies in exile.
$poem_3$,
        'published', now(), '[]'::jsonb, 2
    ),
    (
        '4 years old again.',
        '4-years-old-again',
        'I wanna turn into that little girl\nThe one that is still 4 years old.\nShe knows what your hugs feel like,',
        $poem_4$
I wanna turn into that little girl
The one that is still 4 years old.
She knows what your hugs feel like,
And she laughs as she runs with you on the road.
I wanna come home and sit with you,
Tell you everything that I did,
But you won't get off your phone,
And free time in your schedule won't fit.
I wanna unlearn what you did,
Remember only the times you really cared.
You'll pick me up in your arms again,
To buy me an ice cream in a really crowded fair.
I wanna turn into that little girl,
The one that is still 6 years old.
One night got sick,
But slept in your lap to escape the cold.
I wanna learn to laugh around you,
With feeling too awkward.
I want to look back at old pictures,
And not run away from them like a coward.
I wanna tell you the truth,
I am too tired to tell you more lies.
You'll never get to know how I survived,
While time and time again, that little girl inside slowly dies.
$poem_4$,
        'published', now(), '[]'::jsonb, 3
    ),
    (
        'Buried echoes',
        'buried-echoes',
        'I''ll keep my past life on the shelf\nOnce again, leave it there to die.\nI''ll climb up the little stool',
        $poem_5$
I'll keep my past life on the shelf
Once again, leave it there to die.
I'll climb up the little stool
On the top shelf,
I'll keep my armour that I used in every fight
Then I'll try to walk away from it
Only take a few steps and fall,
The light coming through the windows
Suddenly feeling too bright in the hall.
The voices too loud
But the silence too quiet,
Even in an empty room
I have habit to hide.
I'll turn off the lights but
Music a little too loud,
I'll lie down on the floor but
in my head I'm floating on a cloud.
The bold would seep through my clothes
With the armour no longer there to hold.
My fingers won't move an inch
Even when my body is feeling cold.
I would try to go back to where I started
This time without saying "I'm fine",
Only to find myself lying
Far away from the finishing line.
$poem_5$,
        'published', now(), '[]'::jsonb, 4
    ),
    (
        '10 years?',
        '10-years',
        '“Will you wait a few years for me?”\nWe will buy the curtains and\npaint the walls peach haze,',
        $poem_6$
“Will you wait a few years for me?”
We will buy the curtains and
paint the walls peach haze,
You'll buy the groceries and
I'll buy flowers and a silly little vase,
You can cook the food and
I'll watch them play in this little maze.

“Just another year?”
We'll lay on the floor
With our feet up on the wall,
Even if it's all in my head
I'll try my best not to fall,
On nights when you're not here
I hope that you'll call.
$poem_6$,
        'published', now(), '[]'::jsonb, 5
    ),
    (
        '“If you hear me leaving in the morning, could you just pretend that it was only wind”',
        'if-you-hear-me-leaving-in-the-morning',
        'I remember sitting in the cab,\nWith you next to me.\nNot holding hands,',
        $poem_7$
I remember sitting in the cab,
With you next to me.
Not holding hands,
Odd, as we always used to intertwine
our fingers when we were together.
I kept going on and on about something random
And I saw the look on your face,
I saw the empty eyes staring back at me.
“We'll do this again right?”
“yeah, sure”
I smiled, but it felt like someone pushed me
Off the ledge of a twenty-five-story building.
As I watched you leave,
I realized I'll never see you again.
$poem_7$,
        'published', now(), '[]'::jsonb, 6
    )
on conflict (slug) do nothing;
