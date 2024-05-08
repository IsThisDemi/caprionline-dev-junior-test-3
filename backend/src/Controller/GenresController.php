<?php

namespace App\Controller;

use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class GenresController extends AbstractController
{
    public function __construct(
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer
    ) {}

    //Get the genres list
    #[Route('/genres', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $genres = $this->genreRepository->findAll();
        $data = $this->serializer->serialize($genres, "json");

        return new JsonResponse($data, json: true);
    }
}