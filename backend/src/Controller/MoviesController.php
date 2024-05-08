<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use App\Repository\MovieGenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private MovieGenreRepository $movieGenreRepository,
        private SerializerInterface $serializer
    ) {}

    //Get the movies list
    #[Route('/movies', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $movies = $this->movieRepository->findAll();
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);

        return new JsonResponse($data, json: true);
    }

    //Sort and order the movies
    #[Route('/movies/{sortBy}/{orderBy}', methods: ['GET'], requirements: ['sortBy' => 'recently_uploaded|release_date|rating', 'orderBy' => 'asc|desc'])]
    public function sort(string $sortBy, string $orderBy): JsonResponse
    {
        $movies = [];
        if ($sortBy === "recently_uploaded") {
            $movies = $this->movieRepository->findBy([], ["id" => $orderBy]);
        } elseif ($sortBy === "release_date") {
            $movies = $this->movieRepository->findBy([], ["releaseDate" => $orderBy]);
        } elseif ($sortBy === "rating") {
            $movies = $this->movieRepository->findBy([], ["rating" => $orderBy]);
        }

        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);

        return new JsonResponse($data, json: true);
    }

    //Filter by genre
    #[Route('/movies/genre/{genreId}/{sortBy}/{orderBy}', methods: ['GET'], requirements: ['sortBy' => 'recently_uploaded|release_date|rating', 'orderBy' => 'asc|desc'])]
    public function filterByGenre(int $genreId, string $sortBy, string $orderBy): JsonResponse
    {
        $movies = $this->movieGenreRepository->findByGenreId($genreId, $orderBy, $sortBy);
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);
        return new JsonResponse($data, json: true);
    }
}
