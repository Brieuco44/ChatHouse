<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function app(): Response
    {
        return $this->render('app.html.twig');
    }
}
